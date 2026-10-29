
import { redirect, error } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$app/env/public';

export async function load({ cookies }) {
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

  // Comprobar la sesión.
  const {
    data: { user },
    error: errorSesion
  } = await supabase.auth.getUser();
  console.log(
  'Cookies de sesión:',
  cookies.getAll().map((cookie) => cookie.name)
);

console.log('¿Usuario autenticado?', Boolean(user));
console.log('Error de sesión:', errorSesion?.message ?? 'Ninguno');

  if (errorSesion || !user) {
    redirect(303, '/login');
  }

  // Comprobar que la cuenta sea administradora.
  const { data: perfil, error: errorPerfil } = await supabase
    .from('perfiles')
    .select('nombre_usuario, rol')
    .eq('id', user.id)
    .maybeSingle();

    console.log('Perfil actual:', perfil);
console.log('Error del perfil:', errorPerfil?.message ?? 'Ninguno');
  if (errorPerfil || !perfil || perfil.rol !== 'admin') {
    redirect(303, '/');
  }

  // Obtener la lista de hoteles.
  const { data: hoteles, error: errorHoteles } = await supabase
    .from('hoteles')
    .select(
      'id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde, esta_publicado, creado_en'
    )
    .order('creado_en', { ascending: false });

  if (errorHoteles) {
    console.error('Error al cargar hoteles:', errorHoteles.message);
    throw error(500, 'No se pudieron cargar los hoteles.');
  }

  return {
    nombreUsuario: perfil.nombre_usuario,
    hoteles: hoteles ?? []
  };
}
