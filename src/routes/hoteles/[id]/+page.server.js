
import { error } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$app/env/public';

export async function load({ params, cookies }) {
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

  const { data: hotel, error: errorHotel } = await supabase
    .from('hoteles')
    .select(
      'id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde'
    )
    .eq('id', params.id)
    .eq('esta_publicado', true)
    .maybeSingle();

  if (errorHotel) {
    console.error('Error al consultar el hotel:', errorHotel.message);
    throw error(500, 'No se pudo cargar la información del hotel.');
  }

  if (!hotel) {
    throw error(404, 'Hotel no encontrado o no disponible.');
  }

  // Obtener los comentarios de este hotel.
  const { data: comentariosBase, error: errorComentarios } = await supabase
    .from('comentarios')
    .select('id, comentario, calificacion, creado_en, usuario_id')
    .eq('hotel_id', hotel.id)
    .order('creado_en', { ascending: false });

  if (errorComentarios) {
    console.error('Error al consultar comentarios:', errorComentarios.message);
    throw error(500, 'No se pudieron cargar los comentarios.');
  }

  // Buscar los nombres de los autores en la tabla perfiles.
  const idsUsuarios = [
    ...new Set((comentariosBase ?? []).map((item) => item.usuario_id))
  ];

  let perfiles = [];

  if (idsUsuarios.length > 0) {
    const { data: datosPerfiles, error: errorPerfiles } = await supabase
      .from('perfiles')
      .select('id, nombre_usuario')
      .in('id', idsUsuarios);

    if (errorPerfiles) {
      console.error('Error al consultar perfiles:', errorPerfiles.message);
      throw error(500, 'No se pudieron cargar los autores de los comentarios.');
    }

    perfiles = datosPerfiles ?? [];
  }

  const comentarios = (comentariosBase ?? []).map((item) => ({
    ...item,
    nombre_usuario:
      perfiles.find((perfil) => perfil.id === item.usuario_id)?.nombre_usuario
      ?? 'Usuario'
  }));

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return {
    hotel,
    comentarios,
    usuarioActual: user?.id ?? null
  };
}
