
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

  return { hotel };
}
