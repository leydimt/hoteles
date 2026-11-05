
<script>
  import { onMount } from 'svelte';
  import { clienteSupabase } from '#lib/supabase/cliente.js';

  let usuarioActual = $state(null);
  let hoteles = $state([]);
  let cargando = $state(true);
  let mensajeError = $state('');
  let eliminando = $state(null);

  onMount(async () => {
    try {
      const { data: sesionData, error: errorSesion } =
        await clienteSupabase.auth.getUser();

      if (errorSesion) throw errorSesion;

      usuarioActual = sesionData.user?.id ?? null;

      if (!usuarioActual) {
        cargando = false;
        return;
      }

      const { data: favoritosData, error: errorFavoritos } =
        await clienteSupabase
          .from('favoritos')
          .select('hotel_id')
          .eq('usuario_id', usuarioActual);

      if (errorFavoritos) throw errorFavoritos;

      const idsHoteles = (favoritosData ?? []).map(
        (favorito) => favorito.hotel_id
      );

      if (idsHoteles.length === 0) {
        hoteles = [];
        return;
      }

      const { data: hotelesData, error: errorHoteles } =
        await clienteSupabase
          .from('hoteles')
          .select(
            'id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde'
          )
          .in('id', idsHoteles)
          .eq('esta_publicado', true);

      if (errorHoteles) throw errorHoteles;

      hoteles = hotelesData ?? [];
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      mensajeError = 'No se pudieron cargar tus hoteles favoritos.';
    } finally {
      cargando = false;
    }
  });

  async function quitarFavorito(hotel) {
    if (!usuarioActual || eliminando === hotel.id) return;

    eliminando = hotel.id;
    mensajeError = '';

    try {
      const { error } = await clienteSupabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', usuarioActual)
        .eq('hotel_id', hotel.id);

      if (error) throw error;

      hoteles = hoteles.filter((item) => item.id !== hotel.id);
    } catch (error) {
      console.error('Error al quitar favorito:', error);
      mensajeError = 'No se pudo quitar el hotel de favoritos.';
    } finally {
      eliminando = null;
    }
  }
</script>

<svelte:head>
  <title>Mis favoritos | El Alto Hoteles</title>
  <meta
    name="description"
    content="Consulta los hoteles que guardaste como favoritos."
  />
</svelte:head>

<div class="min-h-screen bg-[#030a20] text-white">
  <header class="border-b border-white/10 bg-[#07122f]">
    <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
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

  <main class="mx-auto max-w-7xl px-6 py-12">
    <div class="mb-10">
      <p class="font-semibold uppercase tracking-widest text-fuchsia-400">
        Tu colección personal
      </p>

      <h1 class="mt-2 text-3xl font-extrabold sm:text-4xl">
        ❤️ Mis favoritos
      </h1>

      <p class="mt-3 text-slate-400">
        Aquí encontrarás los hoteles que guardaste.
      </p>
    </div>

    {#if cargando}
      <p class="text-slate-300">Cargando tus favoritos...</p>

    {:else if !usuarioActual}
      <div class="rounded-2xl border border-white/10 bg-[#0b193b] p-8 text-center">
        <p class="text-lg font-semibold">
          Inicia sesión para ver tus favoritos.
        </p>

        <a
          href="/login"
          class="mt-5 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold"
        >
          Iniciar sesión
        </a>
      </div>

    {:else if mensajeError}
      <p class="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-200">
        {mensajeError}
      </p>

    {:else if hoteles.length === 0}
      <div class="rounded-2xl border border-white/10 bg-[#0b193b] p-10 text-center">
        <p class="text-5xl">🤍</p>

        <h2 class="mt-4 text-xl font-bold">
          Todavía no tienes favoritos
        </h2>

        <p class="mt-3 text-slate-400">
          Explora los hoteles y guarda los que más te interesen.
        </p>

        <a
          href="/#hoteles"
          class="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold"
        >
          Explorar hoteles
        </a>
      </div>

    {:else}
      <p class="mb-6 text-sm text-slate-400">
        Tienes {hoteles.length}
        {hoteles.length === 1 ? 'hotel favorito' : 'hoteles favoritos'}.
      </p>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each hoteles as hotel (hotel.id)}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#0b193b]">
            {#if hotel.imagen_url}
              <img
                src={hotel.imagen_url}
                alt={`Imagen del hotel ${hotel.nombre}`}
                class="h-52 w-full object-cover"
              />
            {:else}
              <div class="flex h-52 items-center justify-center bg-gradient-to-br from-violet-900 to-fuchsia-900">
                Imagen próximamente
              </div>
            {/if}

            <div class="p-5">
              <h2 class="text-xl font-bold">{hotel.nombre}</h2>

              <p class="mt-2 text-sm text-slate-400">
                {hotel.direccion || hotel.ciudad || 'Ubicación no disponible'}
              </p>

              <p class="mt-3 line-clamp-3 text-slate-300">
                {hotel.descripcion || 'Más información próximamente.'}
              </p>

              {#if hotel.precio_desde != null}
                <p class="mt-4 font-semibold text-fuchsia-400">
                  Desde {hotel.precio_desde} Bs.
                </p>
              {/if}

              <div class="mt-5 flex flex-wrap gap-3">
                <a
                  href={`/hoteles/${hotel.id}`}
                  class="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold transition hover:brightness-110"
                >
                  Ver detalles
                </a>

                <button
                  type="button"
                  onclick={() => quitarFavorito(hotel)}
                  disabled={eliminando === hotel.id}
                  class="rounded-xl border border-red-400/40 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  {eliminando === hotel.id
                    ? 'Quitando...'
                    : '❤️ Quitar'}
                </button>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </main>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
    © 2026 El Alto Hoteles. Todos los derechos reservados.
  </footer>
</div>
