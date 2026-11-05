
<script>
  import { clienteSupabase } from '#lib/supabase/cliente.js';
  import { onMount } from 'svelte';

  let ubicacion = $state(null);
  let hoteles = $state([]);
  let cargando = $state(false);
  let mensaje = $state('');
  let error = $state('');

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const radioTierra = 6371;
    const rad = (grados) => grados * Math.PI / 180;

    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    return 2 * radioTierra *
      Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async function buscarHotelesCercanos() {
    error = '';
    mensaje = '';
    hoteles = [];

    if (!navigator.geolocation) {
      error = 'Tu navegador no permite obtener la ubicación.';
      return;
    }

    cargando = true;

    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        ubicacion = {
          latitud: posicion.coords.latitude,
          longitud: posicion.coords.longitude
        };

        try {
          const { data, error: errorConsulta } =
            await clienteSupabase
              .from('hoteles')
              .select('id, nombre, descripcion, direccion, ciudad, imagen_url, precio_desde, latitud, longitud')
              .eq('esta_publicado', true);

          if (errorConsulta) throw errorConsulta;

          hoteles = (data ?? [])
            .filter(hotel =>
              hotel.latitud != null && hotel.longitud != null
            )
            .map(hotel => ({
              ...hotel,
              distancia: calcularDistancia(
                ubicacion.latitud,
                ubicacion.longitud,
                hotel.latitud,
                hotel.longitud
              )
            }))
            .sort((a, b) => a.distancia - b.distancia);

          if (hoteles.length === 0) {
            mensaje = 'Todavía no hay hoteles publicados con coordenadas registradas.';
          }
        } catch (err) {
          error = 'No se pudieron cargar los hoteles. Intenta nuevamente.';
          console.error(err);
        } finally {
          cargando = false;
        }
      },
      (err) => {
        cargando = false;
        error = err.code === 1
          ? 'Debes permitir el acceso a tu ubicación para continuar.'
          : 'No se pudo obtener tu ubicación. Intenta nuevamente.';
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  onMount(() => {
    // La ubicación solo se solicita cuando el turista presiona el botón.
  });
</script>

<svelte:head>
  <title>Hoteles cercanos | El Alto Hoteles</title>
</svelte:head>

<main class="min-h-screen bg-[#020613] px-5 py-12 text-white">
  <section class="mx-auto max-w-5xl">
    <div class="mb-10 text-center">
      <h1 class="mb-4 text-4xl font-bold text-fuchsia-400">
        Hoteles cercanos
      </h1>

      <p class="text-gray-300">
        Encuentra hoteles cerca de tu ubicación actual.
      </p>
    </div>

    <div class="mb-8 rounded-2xl border border-purple-700 bg-[#07122f] p-7 text-center">
      <div class="mb-4 text-5xl">📍</div>

      <h2 class="mb-3 text-xl font-semibold">
        Encuentra hoteles cerca de ti
      </h2>

      <p class="mb-6 text-gray-300">
        Permite que el navegador acceda a tu ubicación para calcular las distancias.
      </p>

      <button
        onclick={buscarHotelesCercanos}
        disabled={cargando}
        class="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-7 py-3 font-bold hover:opacity-90 disabled:opacity-50"
      >
        {cargando ? 'Buscando hoteles...' : '📍 Encontrar hoteles cerca de mí'}
      </button>

      {#if ubicacion}
        <p class="mt-5 text-sm text-green-400">
          Ubicación obtenida correctamente.
        </p>
      {/if}

      {#if error}
        <p class="mt-5 text-red-400">{error}</p>
      {/if}

      {#if mensaje}
        <p class="mt-5 text-yellow-300">{mensaje}</p>
      {/if}
    </div>

    {#if hoteles.length > 0}
      <h2 class="mb-6 text-2xl font-bold">
        Hoteles ordenados por cercanía
      </h2>

      <div class="grid gap-6 md:grid-cols-2">
        {#each hoteles as hotel (hotel.id)}
          <article class="overflow-hidden rounded-2xl border border-purple-800 bg-[#07122f]">
            {#if hotel.imagen_url}
              <img
                src={hotel.imagen_url}
                alt={hotel.nombre}
                class="h-52 w-full object-cover"
              />
            {/if}

            <div class="p-5">
              <h3 class="mb-2 text-xl font-bold text-fuchsia-300">
                {hotel.nombre}
              </h3>

              <p class="mb-2 text-gray-300">
                📍 {hotel.direccion}, {hotel.ciudad}
              </p>

              <p class="mb-3 text-green-400">
                A aproximadamente {hotel.distancia.toFixed(2)} km de ti
              </p>

              <p class="mb-4 text-gray-300">
                {hotel.descripcion ?? ''}
              </p>

              {#if hotel.precio_desde != null}
                <p class="mb-4 font-semibold">
                  Desde: Bs. {hotel.precio_desde}
                </p>
              {/if}

              <a
                href={`/hoteles/${hotel.id}`}
                class="inline-block rounded-lg bg-fuchsia-600 px-5 py-2 font-semibold hover:bg-fuchsia-700"
              >
                Ver hotel
              </a>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</main>
