<script>
  import { goto } from '$app/navigation';
  import { clienteSupabase } from '#lib/supabase/cliente.js';
  import { crearCorreoInterno } from '#lib/usuarios.js';

  let nombreUsuario = $state('');
  let clave = $state('');
  let error = $state('');
  let cargando = $state(false);
  let mostrarClave = $state(false);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    error = '';

    const usuario = nombreUsuario.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,24}$/.test(usuario)) {
      error = 'Escribe un nombre de usuario válido.';
      return;
    }

    if (!clave) {
      error = 'Escribe tu contraseña.';
      return;
    }

    cargando = true;

    try {
      const { data, error: errorAcceso } =
        await clienteSupabase.auth.signInWithPassword({
          email: crearCorreoInterno(usuario),
          password: clave
        });

      if (errorAcceso) {
        error = 'Usuario o contraseña incorrectos.';
        return;
      }

      if (!data.session) {
        error = 'No se pudo establecer la sesión.';
        return;
      }

      await goto('/admin');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      error = 'No se pudo conectar. Inténtalo nuevamente.';
    } finally {
      cargando = false;
    }
  }
</script>




<svelte:head>
  <title>Iniciar sesión | El Alto Hoteles</title>
  <meta
    name="description"
    content="Inicia sesión en El Alto Hoteles con tu nombre de usuario."
  />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-[#030a20] px-4 py-10 text-white">
  <section class="w-full max-w-md rounded-2xl border border-purple-500/30 bg-[#07122f] p-8 shadow-2xl">
    <a href="/" class="text-sm text-fuchsia-300 hover:text-fuchsia-200">
      ← Volver al inicio
    </a>

    <div class="mb-8 mt-6 text-center">
      <h1 class="text-3xl font-bold">
        <span class="text-fuchsia-400">El Alto</span> Hoteles
      </h1>
      <h2 class="mt-5 text-2xl font-semibold">Iniciar sesión</h2>
      <p class="mt-2 text-sm text-slate-300">
        Ingresa con tu nombre de usuario y contraseña.
      </p>
    </div>

    <form onsubmit={iniciarSesion} class="space-y-5">
      <div>
        <label for="nombreUsuario" class="mb-2 block text-sm font-medium">
          Nombre de usuario
        </label>
        <input
          id="nombreUsuario"
          name="nombreUsuario"
          type="text"
          autocomplete="username"
          bind:value={nombreUsuario}
          minlength="3"
          maxlength="24"
          required
          class="w-full rounded-lg border border-slate-600 bg-[#030a20] px-4 py-3 outline-none focus:border-fuchsia-400"
          placeholder="Tu nombre de usuario"
        />
      </div>

      <div>
        <label for="clave" class="mb-2 block text-sm font-medium">
          Contraseña
        </label>
        <div class="flex overflow-hidden rounded-lg border border-slate-600 focus-within:border-fuchsia-400">
          <input
            id="clave"
            name="clave"
            type={mostrarClave ? 'text' : 'password'}
            autocomplete="current-password"
            bind:value={clave}
            required
            class="min-w-0 flex-1 bg-[#030a20] px-4 py-3 outline-none"
            placeholder="Tu contraseña"
          />
          <button
            type="button"
            onclick={() => mostrarClave = !mostrarClave}
            class="bg-[#030a20] px-3 text-sm text-fuchsia-300"
            aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarClave ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      {#if error}
        <p role="alert" class="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      {/if}

      <button
        type="submit"
        disabled={cargando}
        class="w-full rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-300">
      ¿Todavía no tienes cuenta?
      <a href="/registro" class="font-semibold text-fuchsia-300 hover:underline">
        Regístrate aquí
      </a>
    </p>
  </section>
</main>
