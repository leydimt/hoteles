
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { clienteSupabase } from '#lib/supabase/cliente.js';

  let cargando = $state(true);
  let usuario = $state(null);
  let perfil = $state(null);
  let errorMensaje = $state('');

  onMount(async () => {
    try {
      const { data, error } = await clienteSupabase.auth.getUser();

      if (error) throw error;

      usuario = data.user;

      if (!usuario) {
        await goto('/login');
        return;
      }

      const { data: perfilData, error: errorPerfil } =
        await clienteSupabase
          .from('perfiles')
          .select('id, nombre_usuario, rol, creado_en')
          .eq('id', usuario.id)
          .single();

      if (errorPerfil) throw errorPerfil;

      perfil = perfilData;
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      errorMensaje = 'No se pudo cargar la información de tu perfil.';
    } finally {
      cargando = false;
    }
  });

  async function cerrarSesion() {
    const { error } = await clienteSupabase.auth.signOut();

    if (error) {
      errorMensaje = 'No se pudo cerrar la sesión.';
      return;
    }

    await goto('/login');
  }

  function fechaRegistro(fecha) {
    if (!fecha) return 'No disponible';

    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Mi perfil | El Alto Hoteles</title>
  <meta name="description" content="Consulta tu perfil de usuario." />
</svelte:head>

<div class="min-h-screen bg-[#030a20] text-white">
  <header class="border-b border-white/10 bg-[#07122f]">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
      <a href="/" class="text-2xl font-bold">
        El Alto <span class="text-fuchsia-400">Hoteles</span>
      </a>

      <a
        href="/"
        class="rounded-lg border border-fuchsia-400 px-4 py-2 text-sm transition hover:bg-fuchsia-500/10"
      >
        Volver al inicio
      </a>
    </nav>
  </header>

  <main class="mx-auto max-w-3xl px-6 py-16">
    <div class="mb-8 text-center">
      <p class="font-semibold uppercase tracking-widest text-fuchsia-400">
        Tu cuenta
      </p>

      <h1 class="mt-3 text-4xl font-extrabold"
      class="text-white transition">
        Mi perfil
      </h1>

      <p class="mt-3 text-slate-400">
        Consulta la información de tu cuenta en El Alto Hoteles.
      </p>
    </div>

    {#if cargando}
      <div class="rounded-2xl border border-white/10 bg-[#0b193b] p-8 text-center">
        Cargando tu perfil...
      </div>

    {:else if errorMensaje}
      <div class="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-200">
        {errorMensaje}
      </div>

    {:else if perfil}
      <section class="rounded-2xl border border-white/10 bg-[#0b193b] p-8">
        <div class="text-center">
          <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-4xl font-bold">
            {perfil.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
          </div>

          <h2 class="mt-5 text-2xl font-bold">
            {perfil.nombre_usuario}
          </h2>

          <p class="mt-2 text-sm text-fuchsia-400">
            {perfil.rol === 'admin' ? 'Administrador' : 'Turista'}
          </p>
        </div>

        <div class="mt-8 space-y-4 border-t border-white/10 pt-6">
          <div class="rounded-xl bg-[#030a20] p-4">
            <p class="text-sm text-slate-400">Nombre de usuario</p>
            <p class="mt-1 font-semibold">{perfil.nombre_usuario}</p>
          </div>

          <div class="rounded-xl bg-[#030a20] p-4">
            <p class="text-sm text-slate-400">Rol de cuenta</p>
            <p class="mt-1 font-semibold">
              {perfil.rol === 'admin' ? 'Administrador' : 'Turista'}
            </p>
          </div>

          <div class="rounded-xl bg-[#030a20] p-4">
            <p class="text-sm text-slate-400">Fecha de registro</p>
            <p class="mt-1 font-semibold">
              {fechaRegistro(perfil.creado_en)}
            </p>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/favoritos"
            class="flex-1 rounded-xl border border-fuchsia-400 px-5 py-3 text-center font-semibold text-fuchsia-300 transition hover:bg-fuchsia-500/10"
          >
            ❤️ Mis favoritos
          </a>

          <button
            type="button"
            onclick={cerrarSesion}
            class="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold transition hover:brightness-110"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    {/if}
  </main>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
    © 2026 El Alto Hoteles. Todos los derechos reservados.
  </footer>
</div>
