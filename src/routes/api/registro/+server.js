
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';
import { crearCorreoInterno } from '#lib/usuarios.js';

export async function POST({ request }) {
  let datos;

  try {
    datos = await request.json();
  } catch {
    return json(
      { error: 'Los datos enviados no son válidos.' },
      { status: 400 }
    );
  }

  const nombreUsuario = String(datos.nombreUsuario ?? '')
    .trim()
    .toLowerCase();

  const clave = String(datos.clave ?? '');

  if (!/^[a-z0-9_]{3,24}$/.test(nombreUsuario)) {
    return json(
      {
        error: 'El usuario debe tener entre 3 y 24 caracteres: letras, números o guion bajo.'
      },
      { status: 400 }
    );
  }

  if (clave.length < 10 || clave.length > 72) {
    return json(
      { error: 'La contraseña debe tener entre 10 y 72 caracteres.' },
      { status: 400 }
    );
  }

  if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(
      { error: 'Falta configurar la conexión privada con Supabase.' },
      { status: 500 }
    );
  }

  const clienteAdministrador = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );

  const { data: perfilExistente, error: errorConsulta } =
    await clienteAdministrador
      .from('perfiles')
      .select('id')
      .eq('nombre_usuario', nombreUsuario)
      .maybeSingle();

  if (errorConsulta) {
    console.error('Error al comprobar el usuario:', errorConsulta.message);

    return json(
      { error: 'No se pudo comprobar el nombre de usuario.' },
      { status: 500 }
    );
  }

  if (perfilExistente) {
    return json(
      { error: 'Ese nombre de usuario ya está ocupado.' },
      { status: 409 }
    );
  }

  const { data: datosCuenta, error: errorCuenta } =
    await clienteAdministrador.auth.admin.createUser({
      email: crearCorreoInterno(nombreUsuario),
      password: clave,
      email_confirm: true,
      user_metadata: {
        nombre_usuario: nombreUsuario
      }
    });

  if (errorCuenta || !datosCuenta.user) {
    console.error(
      'Error al crear la cuenta:',
      errorCuenta?.message
    );

    return json(
      { error: 'No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo.' },
      { status: 400 }
    );
  }

  const { error: errorPerfil } = await clienteAdministrador
    .from('perfiles')
    .insert({
      id: datosCuenta.user.id,
      nombre_usuario: nombreUsuario,
      rol: 'turista'
    });

  if (errorPerfil) {
    console.error('Error al crear el perfil:', errorPerfil.message);

    // Si no se pudo crear el perfil, intentar eliminar
    // la cuenta para no dejar un usuario incompleto.
    const { error: errorEliminacion } =
      await clienteAdministrador.auth.admin.deleteUser(
        datosCuenta.user.id
      );

    if (errorEliminacion) {
      console.error(
        'No se pudo eliminar la cuenta incompleta:',
        errorEliminacion.message
      );
    }

    return json(
      { error: 'No se pudo terminar de crear el perfil.' },
      { status: 500 }
    );
  }

  return json(
    { correcto: true, mensaje: 'Cuenta creada correctamente.' },
    { status: 201 }
  );
}
