
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$app/env/public';

export async function POST({ request, cookies }) {
  const supabase = createServerClient(
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

  // 1. Verificar la sesión real del usuario.
  const {
    data: { user },
    error: errorSesion
  } = await supabase.auth.getUser();

  if (errorSesion || !user) {
    return json(
      { error: 'Debes iniciar sesión.' },
      { status: 401 }
    );
  }

  // 2. Comprobar que el usuario sea administrador.
  const { data: perfil, error: errorPerfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .maybeSingle();

  if (errorPerfil) {
    console.error('Error al verificar el perfil:', errorPerfil.message);

    return json(
      { error: 'No se pudo verificar el permiso.' },
      { status: 500 }
    );
  }

  if (!perfil || perfil.rol !== 'admin') {
    return json(
      { error: 'Solo un administrador puede publicar hoteles.' },
      { status: 403 }
    );
  }

  // 3. Validar los datos recibidos.
  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

  const { id, esta_publicado } = datos ?? {};

  const uuidValido =
    typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  if (!uuidValido || typeof esta_publicado !== 'boolean') {
    return json(
      { error: 'El identificador o el estado del hotel no son válidos.' },
      { status: 400 }
    );
  }

  // 4. Actualizar únicamente el estado del hotel.
  const { data: hotel, error: errorActualizar } = await supabase
    .from('hoteles')
    .update({ esta_publicado })
    .eq('id', id)
    .select('id, nombre, esta_publicado')
    .maybeSingle();

  if (errorActualizar) {
    console.error(
      'Error al cambiar la publicación:',
      errorActualizar.message
    );

    return json(
      { error: 'No se pudo actualizar el hotel. Verifica las políticas RLS.' },
      { status: 500 }
    );
  }

  if (!hotel) {
    return json(
      { error: 'No se encontró el hotel o no tienes permiso para modificarlo.' },
      { status: 404 }
    );
  }

  return json({
    mensaje: hotel.esta_publicado
      ? 'Hotel publicado correctamente.'
      : 'Publicación del hotel retirada correctamente.',
    hotel
  });
}
