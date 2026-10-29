
<script>
  let { data } = $props();

  let hotel = $derived(data.hotel);
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
  </main>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-400">
    © 2026 El Alto Hoteles. Todos los derechos reservados.
  </footer>
</div>
