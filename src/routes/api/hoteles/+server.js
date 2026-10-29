
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$app/env/public';

// Crear un cliente de Supabase usando la sesión del usuario.
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

// Verificar que el usuario tenga una sesión y sea administrador.
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

  if (errorPermiso) {
    return errorPermiso;
  }

  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

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

  const precio = datos.precio_desde;

  if (!nombre || !direccion || !ciudad) {
    return json(
      { error: 'Completa el nombre, la dirección y la ciudad.' },
      { status: 400 }
    );
  }

  if (
    nombre.length > 150 ||
    descripcion.length > 5000 ||
    direccion.length > 300 ||
    ciudad.length > 100 ||
    imagenUrl.length > 2048
  ) {
    return json(
      { error: 'Uno o más campos superan la longitud permitida.' },
      { status: 400 }
    );
  }

  if (imagenUrl) {
    let imagenValida = false;

    try {
      const url = new URL(imagenUrl);
      imagenValida = ['http:', 'https:'].includes(url.protocol);
    } catch {
      imagenValida = false;
    }

    if (!imagenValida) {
      return json(
        { error: 'La imagen debe tener una URL HTTP o HTTPS válida.' },
        { status: 400 }
      );
    }
  }

  let precioDesde = null;

  if (precio !== '' && precio !== null && precio !== undefined) {
    precioDesde = Number(precio);

    if (
      !Number.isFinite(precioDesde) ||
      precioDesde < 0 ||
      precioDesde > 99999999
    ) {
      return json(
        { error: 'Ingresa un precio válido y no negativo.' },
        { status: 400 }
      );
    }
  }

  const { data: hotel, error: errorInsertar } = await supabase
    .from('hoteles')
    .insert({
      propietario_id: user.id,
      nombre,
      descripcion: descripcion || null,
      direccion,
      ciudad,
      imagen_url: imagenUrl || null,
      precio_desde: precioDesde,
      esta_publicado: false
    })
    .select(
      'id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde, esta_publicado, creado_en'
    )
    .single();

  if (errorInsertar) {
    console.error(
      'Error al registrar hotel:',
      errorInsertar.message
    );

    return json(
      { error: 'No se pudo guardar el hotel. Verifica los permisos de Supabase.' },
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

// PATCH: publicar o retirar la publicación de un hotel.
export async function PATCH({ request, cookies }) {
  const supabase = crearClienteSupabase(cookies);

  const { error: errorPermiso } =
    await verificarAdministrador(supabase);

  if (errorPermiso) {
    return errorPermiso;
  }

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

  const { data: hotel, error: errorActualizar } = await supabase
    .from('hoteles')
    .update({
      esta_publicado: datos.esta_publicado
    })
    .eq('id', datos.id)
    .select('id, nombre, esta_publicado')
    .maybeSingle();

  if (errorActualizar) {
    console.error(
      'Error al actualizar hotel:',
      errorActualizar.message
    );

    return json(
      { error: 'No se pudo actualizar el hotel.' },
      { status: 400 }
    );
  }

  if (!hotel) {
    return json(
      { error: 'No se encontró el hotel o no tienes permiso para actualizarlo.' },
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
