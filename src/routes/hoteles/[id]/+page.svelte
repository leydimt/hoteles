
<script>
  import { invalidateAll } from '$app/navigation';
  import { clienteSupabase } from '#lib/supabase/cliente.js';

  let { data } = $props();

  let hotel = $derived(data.hotel);
  let comentarios = $state(data.comentarios ?? []);
  let comentariosConCalificacion = $derived(
  comentarios.filter((comentario) => comentario.calificacion != null)
);

let promedioCalificacion = $derived(
  comentariosConCalificacion.length > 0
    ? comentariosConCalificacion.reduce(
        (total, comentario) => total + comentario.calificacion,
        0
      ) / comentariosConCalificacion.length
    : 0
);

let estrellasPromedio = $derived(Math.round(promedioCalificacion));
  let comentarioNuevo = $state('');
  let publicando = $state(false);
  let calificacionNueva = $state(5);
  let mensajeComentario = $state('');
  let errorComentario = $state('');

  async function publicarComentario(event) {
    event.preventDefault();

    errorComentario = '';
    mensajeComentario = '';

    if (!data.usuarioActual) {
      errorComentario = 'Debes iniciar sesión para comentar.';
      return;
    }

    const texto = comentarioNuevo.trim();

    if (texto.length < 3 || texto.length > 1000) {
      errorComentario = 'El comentario debe tener entre 3 y 1000 caracteres.';
      return;
    }

    publicando = true;

    try {
      const { error } = await clienteSupabase
        .from('comentarios')
        .insert({
          hotel_id: hotel.id,
          usuario_id: data.usuarioActual,
          comentario: texto,
          calificacion: calificacionNueva
        });

      if (error) throw error;

      comentarioNuevo = '';
      mensajeComentario = '¡Tu comentario se publicó correctamente!';

      await invalidateAll();
    } catch (error) {
      console.error('Error al publicar comentario:', error);
      errorComentario =
        error.message || 'No se pudo publicar el comentario.';
    } finally {
      publicando = false;
    }
  }

  async function eliminarComentario(comentario) {
    const confirmar = confirm('¿Deseas eliminar este comentario?');

    if (!confirmar) return;

    errorComentario = '';
    mensajeComentario = '';

    const { error } = await clienteSupabase
      .from('comentarios')
      .delete()
      .eq('id', comentario.id)
      .eq('usuario_id', data.usuarioActual);

    if (error) {
      console.error('Error al eliminar comentario:', error);
      errorComentario = 'No se pudo eliminar el comentario.';
      return;
    }

    comentarios = comentarios.filter(
      (item) => item.id !== comentario.id
    );

    mensajeComentario = 'Comentario eliminado correctamente.';
  }
</script>

<svelte:head>
  <title>{hotel.nombre} | El Alto Hoteles</title>
  <meta
    name="description"
    content={hotel.descripcion || `Información de ${hotel.nombre} en El Alto Hoteles.`}
  />
</svelte:head>

<div class="min-h-screen bg-[#030a20] text-white">
  <header class="border-b border-white/10 bg-[#07122f]">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
      <a href="/" class="text-2xl font-bold">
        El Alto <span class="text-fuchsia-400">Hoteles</span>
      </a>

      <a
        href="/#hoteles"
        class="rounded-lg border border-fuchsia-400 px-4 py-2 text-sm transition hover:bg-fuchsia-500/10"
      >
        Volver a los hoteles
      </a>
    </nav>
  </header>

  <main class="mx-auto max-w-5xl px-6 py-12">
    <a
      href="/#hoteles"
      class="text-sm text-fuchsia-400 hover:text-fuchsia-300"
    >
      ← Volver a la lista de hoteles
    </a>

    <article class="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0b193b]">
      {#if hotel.imagen_url}
        <img
          src={hotel.imagen_url}
          alt={`Imagen del hotel ${hotel.nombre}`}
          class="h-64 w-full object-cover sm:h-96"
        />
      {:else}
        <div class="flex h-64 items-center justify-center bg-gradient-to-br from-violet-900 to-fuchsia-900 text-slate-200 sm:h-96">
          Imagen próximamente
        </div>
      {/if}

      <div class="p-6 sm:p-10">
        <p class="font-semibold uppercase tracking-widest text-fuchsia-400">
          Información del alojamiento
        </p>

        <h1 class="mt-3 text-3xl font-extrabold sm:text-5xl">
          {hotel.nombre}
        </h1>

        <p class="mt-4 text-slate-300">
          {hotel.direccion || 'Dirección no disponible'}
          {#if hotel.ciudad}
            · {hotel.ciudad}
          {/if}
        </p>

        <div class="mt-8 border-t border-white/10 pt-6">
          <h2 class="text-xl font-bold">Descripción del hotel</h2>
          <p class="mt-3 whitespace-pre-line leading-7 text-slate-300">
            {hotel.descripcion || 'Próximamente se publicará más información sobre este alojamiento.'}
          </p>
        </div>

        {#if hotel.precio_desde != null}
          <div class="mt-8 rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
            <p class="text-sm text-slate-300">Precio desde</p>
            <p class="mt-1 text-3xl font-bold text-fuchsia-400">
              {hotel.precio_desde} Bs.
            </p>
          </div>
        {/if}

        <a
          href="/#hoteles"
          class="mt-8 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold transition hover:brightness-110"
        >
          Explorar otros hoteles
        </a>
      </div>
    </article>

    <!-- Sección de comentarios -->
    <section class="mt-10 rounded-2xl border border-white/10 bg-[#0b193b] p-6 sm:p-8">
      <div class="border-b border-white/10 pb-5">
        <p class="text-sm font-semibold uppercase tracking-widest text-fuchsia-400">
          Opiniones de visitantes
        </p>
        <h2 class="mt-2 text-2xl font-bold">
          Comentarios sobre {hotel.nombre}
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Comparte tu experiencia y conoce las opiniones de otros visitantes.
        </p>
      </div>
      {#if comentariosConCalificacion.length > 0}
  <div class="mt-6 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-5">
    <p class="text-sm font-semibold text-slate-300">
      Valoración general del hotel
    </p>

    <div class="mt-2 flex flex-wrap items-center gap-3">
      <span class="text-3xl font-bold text-yellow-400">
        {promedioCalificacion.toFixed(1)}/5
      </span>

      <div class="flex text-2xl text-yellow-400">
        {#each [1, 2, 3, 4, 5] as estrella}
          <span class:text-slate-600={estrella > estrellasPromedio}>
            ★
          </span>
        {/each}
      </div>
    </div>

    <p class="mt-2 text-sm text-slate-400">
      Basado en {comentariosConCalificacion.length}
      {comentariosConCalificacion.length === 1 ? 'calificación' : 'calificaciones'}
    </p>
  </div>
{:else}
  <p class="mt-6 rounded-xl bg-[#030a20] p-4 text-sm text-slate-400">
    Este hotel todavía no tiene calificaciones.
  </p>
{/if}

      <div class="mt-6">
        {#if data.usuarioActual}
          <form onsubmit={publicarComentario}>
            <label for="comentarioNuevo" class="mb-2 block font-semibold">
              Escribe tu comentario
            </label>
            <div class="mb-5">
  <p class="mb-2 font-semibold">Califica este hotel:</p>

  <div class="flex items-center gap-2">
    {#each [1, 2, 3, 4, 5] as estrella}
      <button
        type="button"
        onclick={() => (calificacionNueva = estrella)}
        aria-label={`Calificar con ${estrella} estrellas`}
        aria-pressed={calificacionNueva === estrella}
        class="text-3xl transition hover:scale-110"
        class:text-yellow-400={estrella <= calificacionNueva}
        class:text-slate-600={estrella > calificacionNueva}
      >
        ★
      </button>
    {/each}
  </div>

  <p class="mt-1 text-sm text-slate-400">
    Tu calificación: {calificacionNueva} de 5 estrellas
  </p>
</div>

            <textarea
              id="comentarioNuevo"
              bind:value={comentarioNuevo}
              maxlength="1000"
              rows="4"
              placeholder="Cuéntanos tu experiencia en este hotel..."
              class="w-full rounded-xl border border-white/10 bg-[#030a20] p-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400"
              required
            ></textarea>

            <div class="mt-2 flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs text-slate-400">
                {comentarioNuevo.length}/1000 caracteres
              </span>

              <button
                type="submit"
                disabled={publicando}
                class="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold transition hover:brightness-110 disabled:opacity-50"
              >
                {publicando ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
          </form>
        {:else}
          <div class="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
            <p class="text-slate-200">
              Para publicar un comentario debes iniciar sesión.
            </p>
            <a
              href="/login"
              class="mt-3 inline-block font-semibold text-fuchsia-400 hover:text-fuchsia-300"
            >
              Iniciar sesión →
            </a>
          </div>
        {/if}

        {#if errorComentario}
          <p class="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
            {errorComentario}
          </p>
        {/if}

        {#if mensajeComentario}
          <p class="mt-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-300">
            {mensajeComentario}
          </p>
        {/if}
      </div>

      <div class="mt-8 border-t border-white/10 pt-6">
        <h3 class="text-lg font-bold">
          Comentarios ({comentarios.length})
        </h3>

        {#if comentarios.length === 0}
          <p class="mt-5 rounded-xl bg-[#030a20] p-5 text-center text-slate-400">
            Todavía no hay comentarios. ¡Sé el primero en compartir tu opinión!
          </p>
        {:else}
          <div class="mt-5 space-y-4">
            {#each comentarios as comentario (comentario.id)}
              <article class="rounded-xl border border-white/10 bg-[#030a20] p-5">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="font-bold text-fuchsia-300">
                    {comentario.nombre_usuario}
                  </p>

                  <time class="text-xs text-slate-400">
                    {new Date(comentario.creado_en).toLocaleString('es-BO')}
                  </time>
                </div>

                {#if comentario.calificacion}
  <div
    class="mt-3 flex items-center gap-1 text-xl text-yellow-400"
    aria-label={`Calificación: ${comentario.calificacion} de 5 estrellas`}
  >
    {#each [1, 2, 3, 4, 5] as estrella}
      <span class:text-slate-600={estrella > comentario.calificacion}>
        ★
      </span>
    {/each}

    <span class="ml-2 text-xs text-slate-400">
      {comentario.calificacion}/5
    </span>
  </div>
{/if}

<p class="mt-3 whitespace-pre-line leading-7 text-slate-300">
  {comentario.comentario}
</p>

                {#if data.usuarioActual === comentario.usuario_id}
                  <button
                    type="button"
                    onclick={() => eliminarComentario(comentario)}
                    class="mt-4 text-sm font-semibold text-red-400 hover:text-red-300"
                  >
                    Eliminar mi comentario
                  </button>
                {/if}
              </article>
            {/each}
          </div>
        {/if}
      </div>
    </section>
  </main>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
    © 2026 El Alto Hoteles. Todos los derechos reservados.
  </footer>
</div>
