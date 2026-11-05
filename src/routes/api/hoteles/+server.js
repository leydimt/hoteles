
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$app/env/public';

// Crear cliente Supabase usando la sesión del usuario.
function crearClienteSupabase(cookies) {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookies.set(name, value, {
              ...options,
              path: '/'
            });
          }
        }
      }
    }
  );
}

// Verificar sesión y permisos de administrador.
async function verificarAdministrador(supabase) {
  const {
    data: { user },
    error: errorSesion
  } = await supabase.auth.getUser();

  if (errorSesion || !user) {
    return {
      error: json(
        { error: 'Debes iniciar sesión.' },
        { status: 401 }
      )
    };
  }

  const { data: perfil, error: errorPerfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .maybeSingle();

  if (errorPerfil) {
    return {
      error: json(
        { error: 'No se pudo verificar el permiso.' },
        { status: 500 }
      )
    };
  }

  if (!perfil || perfil.rol !== 'admin') {
    return {
      error: json(
        { error: 'No tienes permiso para realizar esta acción.' },
        { status: 403 }
      )
    };
  }

  return { user };
}

// Validar los datos de un hotel.
function validarDatos(datos) {
  const nombre = typeof datos.nombre === 'string'
    ? datos.nombre.trim()
    : '';

  const descripcion = typeof datos.descripcion === 'string'
    ? datos.descripcion.trim()
    : '';

  const direccion = typeof datos.direccion === 'string'
    ? datos.direccion.trim()
    : '';

  const ciudad = typeof datos.ciudad === 'string'
    ? datos.ciudad.trim()
    : '';

  const imagenUrl = typeof datos.imagen_url === 'string'
    ? datos.imagen_url.trim()
    : '';

  if (!nombre || !direccion || !ciudad) {
    return {
      error: 'Completa el nombre, la dirección y la ciudad.'
    };
  }

  if (
    nombre.length > 150 ||
    descripcion.length > 5000 ||
    direccion.length > 300 ||
    ciudad.length > 100 ||
    imagenUrl.length > 2048
  ) {
    return {
      error: 'Uno o más campos superan la longitud permitida.'
    };
  }

  if (imagenUrl) {
    try {
      const url = new URL(imagenUrl);

      if (!['http:', 'https:'].includes(url.protocol)) {
        return {
          error: 'La URL de la imagen no es válida.'
        };
      }
    } catch {
      return {
        error: 'La URL de la imagen no es válida.'
      };
    }
  }

  let precioDesde = null;

  if (
    datos.precio_desde !== '' &&
    datos.precio_desde !== null &&
    datos.precio_desde !== undefined
  ) {
    precioDesde = Number(datos.precio_desde);

    if (
      !Number.isFinite(precioDesde) ||
      precioDesde < 0 ||
      precioDesde > 99999999
    ) {
      return {
        error: 'Ingresa un precio válido y no negativo.'
      };
    }
  }

  return {
    valores: {
      nombre,
      descripcion: descripcion || null,
      direccion,
      ciudad,
      imagen_url: imagenUrl || null,
      precio_desde: precioDesde
    }
  };
}

// GET: comprobar que la ruta funciona.
export function GET() {
  return json({
    mensaje: 'La ruta /api/hoteles funciona correctamente.'
  });
}

// POST: registrar un hotel como borrador.
export async function POST({ request, cookies }) {
  const supabase = crearClienteSupabase(cookies);

  const { user, error: errorPermiso } =
    await verificarAdministrador(supabase);

  if (errorPermiso) return errorPermiso;

  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

  const validacion = validarDatos(datos);

  if (validacion.error) {
    return json(
      { error: validacion.error },
      { status: 400 }
    );
  }

  const { data: hotel, error } = await supabase
    .from('hoteles')
    .insert({
      propietario_id: user.id,
      ...validacion.valores,
      esta_publicado: false
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error al registrar hotel:', error.message);

    return json(
      { error: 'No se pudo guardar el hotel.' },
      { status: 400 }
    );
  }

  return json(
    {
      mensaje: 'Hotel registrado correctamente como borrador.',
      hotel
    },
    { status: 201 }
  );
}

// PATCH: publicar o retirar publicación.
export async function PATCH({ request, cookies }) {
  const supabase = crearClienteSupabase(cookies);

  const { error: errorPermiso } =
    await verificarAdministrador(supabase);

  if (errorPermiso) return errorPermiso;

  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos no son válidos.' },
      { status: 400 }
    );
  }

  if (
    typeof datos.id !== 'string' ||
    typeof datos.esta_publicado !== 'boolean'
  ) {
    return json(
      { error: 'Datos incompletos o inválidos.' },
      { status: 400 }
    );
  }

  const { data: hotel, error } = await supabase
    .from('hoteles')
    .update({
      esta_publicado: datos.esta_publicado
    })
    .eq('id', datos.id)
    .select('id, nombre, esta_publicado')
    .maybeSingle();

  if (error) {
    console.error('Error al publicar hotel:', error.message);

    return json(
      { error: 'No se pudo actualizar el hotel.' },
      { status: 400 }
    );
  }

  if (!hotel) {
    return json(
      { error: 'No se encontró el hotel.' },
      { status: 404 }
    );
  }

  return json({
    mensaje: hotel.esta_publicado
      ? 'Hotel publicado correctamente.'
      : 'Publicación retirada correctamente.',
    hotel
  });
}

// PUT: editar un hotel.
export async function PUT({ request, cookies }) {
  const supabase = crearClienteSupabase(cookies);

  const { error: errorPermiso } =
    await verificarAdministrador(supabase);

  if (errorPermiso) return errorPermiso;

  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

  if (typeof datos.id !== 'string' || !datos.id.trim()) {
    return json(
      { error: 'Falta el identificador del hotel.' },
      { status: 400 }
    );
  }

  const validacion = validarDatos(datos);

  if (validacion.error) {
    return json(
      { error: validacion.error },
      { status: 400 }
    );
  }

  const { data: hotel, error } = await supabase
    .from('hoteles')
    .update(validacion.valores)
    .eq('id', datos.id)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error al editar hotel:', error.message);

    return json(
      { error: 'No se pudo editar el hotel.' },
      { status: 400 }
    );
  }

  if (!hotel) {
    return json(
      { error: 'No se encontró el hotel.' },
      { status: 404 }
    );
  }

  return json({
    mensaje: 'Hotel actualizado correctamente.',
    hotel
  });
}

// DELETE: eliminar un hotel.
export async function DELETE({ request, cookies }) {
  const supabase = crearClienteSupabase(cookies);

  const { error: errorPermiso } =
    await verificarAdministrador(supabase);

  if (errorPermiso) return errorPermiso;

  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

  if (typeof datos.id !== 'string' || !datos.id.trim()) {
    return json(
      { error: 'Falta el identificador del hotel.' },
      { status: 400 }
    );
  }

  const { data: hotel, error } = await supabase
    .from('hoteles')
    .delete()
    .eq('id', datos.id)
    .select('id, nombre')
    .maybeSingle();

  if (error) {
    console.error('Error al eliminar hotel:', error.message);

    return json(
      { error: 'No se pudo eliminar el hotel.' },
      { status: 400 }
    );
  }

  if (!hotel) {
    return json(
      { error: 'No se encontró el hotel.' },
      { status: 404 }
    );
  }

  return json({
    mensaje: 'Hotel eliminado correctamente.',
    hotel
  });
}
