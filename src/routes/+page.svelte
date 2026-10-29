
<script>
  import { onMount } from 'svelte';
  import { clienteSupabase } from '#lib/supabase/cliente.js';
  let hoteles = $state([]);
  let cargando = $state(true);
  let mensajeError = $state('');
  let busqueda = $state('');
  let hotelesFiltrados = $derived(
  hoteles.filter((hotel) => {
    const texto = busqueda.trim().toLowerCase();

    return (
      hotel.nombre?.toLowerCase().includes(texto) ||
      hotel.ciudad?.toLowerCase().includes(texto) ||
      hotel.direccion?.toLowerCase().includes(texto)
    );
  })
);

  onMount(async () => {
    const { data, error } = await clienteSupabase
      .from('hoteles')
      .select(
        'id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde'
      )
      .eq('esta_publicado', true)
      .order('creado_en', { ascending: false });

    if (error) {
      mensajeError = 'No se pudieron cargar los hoteles.';
      console.error('Error al consultar hoteles:', error.message);
    } else {
      hoteles = data ?? [];
    }

    cargando = false;
  });
</script>

<svelte:head>
  <title>El Alto Hoteles | Encuentra tu alojamiento</title>
  <meta
    name="description"
    content="Descubre hoteles y opciones de alojamiento en El Alto, Bolivia."
  />
</svelte:head>

<header class="border-b border-white/10 bg-[#07122f]">
  <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
    <a href="/" class="text-2xl font-bold text-white">
      El Alto <span class="text-fuchsia-400">Hoteles</span>
    </a>

    
<div class="flex flex-wrap items-center gap-5 text-sm text-slate-200">
  <a href="#inicio" class="hover:text-fuchsia-400">
    Inicio
  </a>

  <a href="#hoteles" class="hover:text-fuchsia-400">
    Hoteles
  </a>

  <a href="#nosotros" class="hover:text-fuchsia-400">
    Nosotros
  </a>

  <a
    href="/login"
    class="rounded-lg border border-fuchsia-400 px-4 py-2 hover:bg-fuchsia-500/10"
  >
    Iniciar sesión
  </a>

  <a
    href="/registro"
    class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 font-semibold text-white transition hover:brightness-110"
  >
    Registro
  </a>

  <a
    href="/admin"
    class="rounded-lg border border-purple-400 px-4 py-2 font-semibold text-white transition hover:bg-purple-600/20"
  >
    Administración
  </a>
</div>

  </nav>
</header>

<main class="min-h-screen bg-[#030a20] text-white">
  <section
    id="inicio"
    class="relative overflow-hidden px-6 py-24 text-center sm:py-32"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#030a20] to-fuchsia-900/20"
    ></div>

    <div class="relative mx-auto max-w-4xl">
      <p class="mb-5 font-semibold uppercase tracking-[0.25em] text-fuchsia-400">
        Descubre El Alto, Bolivia
      </p>

      <h1 class="text-4xl font-extrabold leading-tight sm:text-6xl">
        Impulsa tu hotel.
        <span class="text-fuchsia-400">Conecta con más personas.</span>
      </h1>

      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
        Encuentra alojamientos, conoce sus servicios y descubre opciones
        para tu próxima visita a la ciudad de El Alto.
      </p>

      <a
        href="#hoteles"
        class="mt-9 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-semibold shadow-lg transition hover:scale-105"
      >
        Explorar hoteles
      </a>
    </div>
  </section>

  <section id="hoteles" class="mx-auto max-w-7xl px-6 py-16">
    <div class="mb-8">
      <p class="font-semibold uppercase tracking-widest text-fuchsia-400">
        Alojamientos
      </p>
      <h2 class="mt-2 text-3xl font-bold">Hoteles destacados</h2>
      <p class="mt-3 text-slate-400">
        Conoce las opciones disponibles en nuestra plataforma.
      </p>
      
<div class="mt-6 flex flex-col gap-3 sm:flex-row">
  <input
    type="search"
    bind:value={busqueda}
    placeholder="Buscar por nombre, ciudad o dirección..."
    aria-label="Buscar hoteles por nombre, ciudad o dirección"
    class="w-full rounded-xl border border-white/10 bg-[#07122f] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-fuchsia-400 sm:max-w-xl"
  />

  {#if busqueda}
    <button
      type="button"
      onclick={() => (busqueda = '')}
      class="rounded-xl border border-fuchsia-400 px-5 py-3 font-semibold text-fuchsia-300 transition hover:bg-fuchsia-500/10"
    >
      Limpiar
    </button>
  {/if}
</div>

    </div>

    {#if cargando}
      <p class="text-slate-300">Cargando hoteles...</p>
    {:else if mensajeError}
      <p class="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-200">
        {mensajeError}
      </p>
    {:else if hotelesFiltrados.length === 0}
      <div class="rounded-2xl border border-white/10 bg-[#0b193b] p-8 text-center">
        <h3 class="text-xl font-semibold">Próximamente</h3>
        <p class="mt-3 text-slate-300">
          Todavía no hay hoteles publicados. Cuando se registren y publiquen,
          aparecerán aquí.
        </p>
      </div>
    {:else}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each hotelesFiltrados as hotel (hotel.id)}
          <article class="overflow-hidden rounded-2xl border border-white/10 bg-[#0b193b]">
            {#if hotel.imagen_url}
              <img
                src={hotel.imagen_url}
                alt={'Imagen del hotel ' + hotel.nombre}
                class="h-52 w-full object-cover"
              />
            {:else}
              <div class="flex h-52 items-center justify-center bg-gradient-to-br from-violet-900 to-fuchsia-900 text-slate-200">
                Imagen próximamente
              </div>
            {/if}

            <div class="p-5">
              <h3 class="text-xl font-bold">{hotel.nombre}</h3>

              <p class="mt-2 text-sm text-slate-400">
                {hotel.direccion || hotel.ciudad}
              </p>

              <p class="mt-3 line-clamp-3 text-slate-300">
                {hotel.descripcion || 'Más información próximamente.'}
              </p>

              {#if hotel.precio_desde != null}
                <p class="mt-4 font-semibold text-fuchsia-400">
                  Desde {hotel.precio_desde} Bs.
                </p>
              {/if}
              
               <a
               href={`/hoteles/${hotel.id}`}
               class="mt-5 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white transition hover:brightness-110"
               >
               Ver detalles
               </a>

            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
<section
  id="nosotros"
  class="relative overflow-hidden border-t border-white/10 px-6 py-16"
  style="background-image: linear-gradient(rgba(7, 18, 47, 0.70), rgba(7, 18, 47, 0.85)), url('src/routes/imagenes/WhatsApp Image 2026-10-28 at 5.22.02 PM.jpeg'); background-size: cover; background-position: center;"
>
  <div class="relative z-10 mx-auto max-w-4xl text-center">

    <h2 class="text-3xl font-bold text-white">
      Conectamos a los viajeros con El Alto
    </h2>

    <p class="mt-5 leading-7 text-slate-300">
      Nuestra plataforma busca facilitar el descubrimiento de alojamientos
      y ayudar a los establecimientos a mostrar su información.
    </p>

  </div>
</section>
</main>

<footer class="bg-[#020719] px-6 py-6 text-center text-sm text-slate-400">
  © 2026 El Alto Hoteles. Todos los derechos reservados.
</footer>
