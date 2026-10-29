
<script>
  
  import { clienteSupabase } from '#lib/supabase/cliente.js';
import { crearCorreoInterno } from '#lib/usuarios.js';
  let nombreUsuario = $state ('');
  let clave = $state('');
  let confirmarClave = $state('');
  let mensaje = $state('');
  let esError = $state(false);
  let enviando = $state(false);

  async function registrar(evento) {
    evento.preventDefault();

    mensaje = '';
    esError = false;

    const usuarioNormalizado = nombreUsuario.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,24}$/.test(usuarioNormalizado)) {
      mensaje =
        'Usa entre 3 y 24 caracteres: letras sin tilde, números o guion bajo.';
      esError = true;
      return;
    }

    if (clave.length < 10 || clave.length > 72) {
      mensaje = 'La contraseña debe tener entre 10 y 72 caracteres.';
      esError = true;
      return;
    }

    if (clave !== confirmarClave) {
      mensaje = 'Las contraseñas no coinciden.';
      esError = true;
      return;
    }

    enviando = true;

    try {
      const respuesta = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombreUsuario: usuarioNormalizado,
          clave
        })
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        mensaje = resultado.error || 'No se pudo crear la cuenta.';
        esError = true;
        return;
      }

      const { error: errorInicio } =
        await clienteSupabase.auth.signInWithPassword({
          email: crearCorreoInterno(usuarioNormalizado),
          password: clave
        });

      if (errorInicio) {
        mensaje =
          'La cuenta se creó, pero no se pudo iniciar sesión automáticamente. Ve a Iniciar sesión e inténtalo.';
        esError = true;
        return;
      }

      window.location.assign('/');
    } catch (error) {
      console.error('Error durante el registro:', error);
      mensaje = 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
      esError = true;
    } finally {
      enviando = false;
    }
  }
</script>

<svelte:head>
  <title>Crear cuenta | El Alto Hoteles</title>
  <meta
    name="description"
    content="Crea tu cuenta en El Alto Hoteles."
  />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-[#030a20] px-5 py-12 text-white">
  <section class="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b193b] p-8 shadow-2xl">
    <a href="/" class="text-sm text-fuchsia-300 hover:text-fuchsia-200">
      ← Volver al inicio
    </a>

    <p class="mt-8 text-sm font-semibold uppercase tracking-widest text-fuchsia-400">
      El Alto Hoteles
    </p>

    <h1 class="mt-3 text-3xl font-bold">Crear una cuenta</h1>

    <p class="mt-3 text-slate-300">
      Regístrate para comenzar a utilizar nuestra plataforma.
    </p>

    <form class="mt-8 space-y-5" onsubmit={registrar}>
      <div>
        <label for="nombreUsuario" class="mb-2 block text-sm font-medium">
          Nombre de usuario
        </label>

        <input
          id="nombreUsuario"
          name="nombreUsuario"
          type="text"
          autocomplete="username"
          minlength="3"
          maxlength="24"
          pattern="[a-zA-Z0-9_]+"
          bind:value={nombreUsuario}
          required
          class="w-full rounded-lg border border-slate-600 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
          placeholder="Ejemplo: hotelista123"
        />

        <p class="mt-2 text-xs text-slate-400">
          De 3 a 24 caracteres: letras, números o guion bajo.
        </p>
      </div>

      <div>
        <label for="clave" class="mb-2 block text-sm font-medium">
          Contraseña
        </label>

        <input
          id="clave"
          name="clave"
          type="password"
          autocomplete="new-password"
          minlength="10"
          maxlength="72"
          bind:value={clave}
          required
          class="w-full rounded-lg border border-slate-600 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
          placeholder="Crea una contraseña"
        />
      </div>

      <div>
        <label for="confirmarClave" class="mb-2 block text-sm font-medium">
          Confirmar contraseña
        </label>

        <input
          id="confirmarClave"
          name="confirmarClave"
          type="password"
          autocomplete="new-password"
          minlength="10"
          maxlength="72"
          bind:value={confirmarClave}
          required
          class="w-full rounded-lg border border-slate-600 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
          placeholder="Escribe la contraseña otra vez"
        />
      </div>

      {#if mensaje}
        <p
          role="status"
          aria-live="polite"
          class="rounded-lg p-3 text-sm {esError ? 'border border-red-400/30 bg-red-500/10 text-red-200' : 'border border-green-400/30 bg-green-500/10 text-green-200'}"
        >
          {mensaje}
        </p>
      {/if}

      <button
        type="submit"
        disabled={enviando}
        class="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? 'Creando cuenta...' : 'Registrarme'}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-300">
      ¿Ya tienes una cuenta?
      <a href="/login" class="font-semibold text-fuchsia-300 hover:underline">
        Inicia sesión
      </a>
    </p>
  </section>
</main>
