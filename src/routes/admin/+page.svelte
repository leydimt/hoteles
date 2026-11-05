
<script>


  import { goto } from '$app/navigation';
  import { clienteSupabase } from '#lib/supabase/cliente.js';

  let { data } = $props();

let hoteles = $state([]);
let busquedaHotel = $state('');
let hotelesFiltrados = $derived(
  hoteles.filter((hotel) => {
    const busqueda = busquedaHotel.trim().toLowerCase();

    return (
      hotel.nombre?.toLowerCase().includes(busqueda) ||
      hotel.ciudad?.toLowerCase().includes(busqueda) ||
      hotel.direccion?.toLowerCase().includes(busqueda)
    );
  })
);
$effect(() => {
  hoteles = data.hoteles ?? [];
});
  let actualizandoId = $state('');
  let eliminandoId = $state('');

  let cerrandoSesion = $state(false);
  let guardando = $state(false);
  let mensajeError = $state('');
  let mensajeExito = $state('');
 
  let nombre = $state('');
  let descripcion = $state('');
  let direccion = $state('');
  let ciudad = $state('El Alto');
  let imagen_url = $state('');
  let archivoImagen = $state(null);
  let vistaPrevia = $state('');
  let precio_desde = $state('');

  
  async function cambiarPublicacion(hotel) {
  actualizandoId = hotel.id;
  mensajeError = '';
  mensajeExito = '';

  try {
    const respuesta = await fetch('/api/hoteles', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: hotel.id,
        esta_publicado: !hotel.esta_publicado
      })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mensajeError = resultado.error || 'No se pudo actualizar el hotel.';
      return;
    }

    hoteles = hoteles.map((item) =>
      item.id === hotel.id
        ? { ...item, esta_publicado: resultado.hotel.esta_publicado }
        : item
    );

    mensajeExito = resultado.hotel.esta_publicado
      ? 'Hotel publicado correctamente.'
      : 'Hotel ocultado correctamente.';
  } catch {
    mensajeError = 'No se pudo conectar con el servidor.';
  } finally {
    actualizandoId = '';
  }
}
  async function cerrarSesion() {
    cerrandoSesion = true;
    mensajeError = '';

    const { error } = await clienteSupabase.auth.signOut();

    if (error) {
      mensajeError = 'No se pudo cerrar la sesión.';
      cerrandoSesion = false;
      return;
    }

    await goto('/login');
  }
function seleccionarImagen(event) {
  const archivo = event.currentTarget.files?.[0];

  mensajeError = '';
  archivoImagen = null;
  vistaPrevia = '';

  if (!archivo) return;

  if (!archivo.type.startsWith('image/')) {
    mensajeError = 'Selecciona un archivo de imagen válido.';
    event.currentTarget.value = '';
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    mensajeError = 'La imagen no debe superar los 5 MB.';
    event.currentTarget.value = '';
    return;
  }

  archivoImagen = archivo;
  vistaPrevia = URL.createObjectURL(archivo);
}
 
async function registrarHotel(event) {
  event.preventDefault();

  const formulario = event.currentTarget;
  guardando = true;
  mensajeError = '';
  mensajeExito = '';

  try {
    console.log('[Hoteles] Enviando petición al servidor');
    let imagenParaGuardar = imagen_url.trim();

if (archivoImagen) {
  const nombreSeguro = archivoImagen.name.replace(
    /[^a-zA-Z0-9._-]/g,
    '-'
  );

  const rutaImagen =
    `${crypto.randomUUID()}-${nombreSeguro}`;

  const { error: errorSubida } = await clienteSupabase.storage
    .from('hoteles')
    .upload(rutaImagen, archivoImagen, {
      contentType: archivoImagen.type,
      upsert: false
    });

  if (errorSubida) {
    console.error('Error al subir imagen:', errorSubida.message);
    mensajeError =
      'No se pudo subir la imagen. Revisa las políticas de Storage.';
    return;
  }

  const { data: urlPublica } = clienteSupabase.storage
    .from('hoteles')
    .getPublicUrl(rutaImagen);

  imagenParaGuardar = urlPublica.publicUrl;
}

    const respuesta = await fetch('/api/hoteles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        descripcion,
        direccion,
        ciudad,
        imagen_url: imagenParaGuardar,
        precio_desde
      })
    });

    console.log('[Hoteles] Estado HTTP:', respuesta.status);

    const resultado = await respuesta.json();

    console.log('[Hoteles] Respuesta del servidor:', resultado);

    if (!respuesta.ok) {
      mensajeError =
        resultado.error || 'No se pudo registrar el hotel.';
      return;
    }

    mensajeExito =
      resultado.mensaje || 'Hotel registrado correctamente como borrador.';

    nombre = '';
    descripcion = '';
    direccion = '';
    ciudad = 'El Alto';
    imagen_url = '';
    archivoImagen = null;
vistaPrevia = '';
event.currentTarget.reset();
    precio_desde = '';
  } catch (error) {
    console.error('[Hoteles] Error:', error);

    mensajeError =
      'No se pudo completar el registro. Revisa la consola y la terminal.';
  } finally {
    guardando = false;
  }
}

async function eliminarHotel(hotel) {
  const confirmar = confirm(
    `¿Estás seguro de que deseas eliminar el hotel "${hotel.nombre}"? Esta acción no se puede deshacer.`
  );

  if (!confirmar) return;

  eliminandoId = hotel.id;
  mensajeError = '';
  mensajeExito = '';

  try {
    const respuesta = await fetch('/api/hoteles', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: hotel.id
      })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error || 'No se pudo eliminar el hotel.'
      );
    }

    hoteles = hoteles.filter(
      (item) => item.id !== hotel.id
    );

    mensajeExito = 'Hotel eliminado correctamente.';

  } catch (error) {
    console.error('Error al eliminar hotel:', error);
    mensajeError = error.message || 'No se pudo eliminar el hotel.';
  } finally {
    eliminandoId = '';
  }
}


// Estado para editar hoteles
let editandoId = $state('');
let guardandoEdicion = $state(false);

let nombreEdicion = $state('');
let descripcionEdicion = $state('');
let direccionEdicion = $state('');
let ciudadEdicion = $state('');
let imagenEdicion = $state('');
let precioEdicion = $state('');

let archivoEdicion = $state(null);
let vistaPreviaEdicion = $state('');

function abrirEdicion(hotel) {
  editandoId = hotel.id;
  nombreEdicion = hotel.nombre ?? '';
  descripcionEdicion = hotel.descripcion ?? '';
  direccionEdicion = hotel.direccion ?? '';
  ciudadEdicion = hotel.ciudad ?? '';
  imagenEdicion = hotel.imagen_url ?? '';
  precioEdicion = hotel.precio_desde ?? '';

  archivoEdicion = null;
  vistaPreviaEdicion = hotel.imagen_url ?? '';

  mensajeError = '';
  mensajeExito = '';
}

function seleccionarImagenEdicion(event) {
  const archivo = event.currentTarget.files?.[0];

  archivoEdicion = null;
  vistaPreviaEdicion = '';

  if (!archivo) return;

  if (!archivo.type.startsWith('image/')) {
    mensajeError = 'Selecciona una imagen válida.';
    event.currentTarget.value = '';
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    mensajeError = 'La imagen no debe superar los 5 MB.';
    event.currentTarget.value = '';
    return;
  }

  mensajeError = '';
  archivoEdicion = archivo;
  vistaPreviaEdicion = URL.createObjectURL(archivo);
}

async function guardarEdicion(event) {
  event.preventDefault();

  const formulario = event.currentTarget;
  guardandoEdicion = true;
  mensajeError = '';
  mensajeExito = '';

  try {
    let imagenParaGuardar = imagenEdicion.trim();

    if (archivoEdicion) {
      const nombreSeguro = archivoEdicion.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '-'
      );

      const rutaImagen =
        `${crypto.randomUUID()}-${nombreSeguro}`;

      const { error: errorSubida } = await clienteSupabase.storage
        .from('hoteles')
        .upload(rutaImagen, archivoEdicion, {
          contentType: archivoEdicion.type,
          upsert: false
        });

      if (errorSubida) {
        throw new Error('No se pudo subir la nueva fotografía.');
      }

      const { data: urlPublica } = clienteSupabase.storage
        .from('hoteles')
        .getPublicUrl(rutaImagen);

      imagenParaGuardar = urlPublica.publicUrl;
    }

    const respuesta = await fetch('/api/hoteles', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: editandoId,
        nombre: nombreEdicion,
        descripcion: descripcionEdicion,
        direccion: direccionEdicion,
        ciudad: ciudadEdicion,
        imagen_url: imagenParaGuardar,
        precio_desde: precioEdicion
      })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error || 'No se pudo actualizar el hotel.'
      );
    }

    hoteles = hoteles.map((hotel) =>
      hotel.id === editandoId
        ? { ...hotel, ...resultado.hotel }
        : hotel
    );

    mensajeExito = 'Hotel actualizado correctamente.';

    editandoId = '';
    archivoEdicion = null;
    vistaPreviaEdicion = '';

    formulario.reset();

  } catch (error) {
    console.error('Error al editar hotel:', error);
    mensajeError = error.message || 'Ocurrió un error al editar.';
  } finally {
    guardandoEdicion = false;
  }
}

function cancelarEdicion() {
  editandoId = '';
  archivoEdicion = null;
  vistaPreviaEdicion = '';
  mensajeError = '';
}


</script>

<svelte:head>
  <title>Administración | El Alto Hoteles</title>
  <meta
    name="description"
    content="Panel de administración de El Alto Hoteles."
  />
</svelte:head>

<main class="min-h-screen bg-[#030a20] text-white">
  <header class="border-b border-white/10 bg-[#07122f]">
    <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
      <a href="/" class="text-2xl font-bold">
        El Alto <span class="text-fuchsia-400">Hoteles</span>
      </a>

      <button
        onclick={cerrarSesion}
        disabled={cerrandoSesion}
        class="rounded-lg border border-fuchsia-400 px-4 py-2 hover:bg-fuchsia-500/10 disabled:opacity-50"
      >
        {cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
    </nav>
  </header>

  <section class="mx-auto max-w-7xl px-6 py-12">
    <p class="mb-2 text-sm text-fuchsia-300">PANEL PRIVADO</p>

    <h1 class="text-3xl font-bold md:text-4xl">
      Panel de administración
    </h1>

    <p class="mt-3 text-slate-300">
      Bienvenido, {data.nombreUsuario}. Administra los hoteles
      de El Alto Hoteles desde aquí.
    </p>

    {#if mensajeError}
      <p class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-300" role="alert">
        {mensajeError}
      </p>
    {/if}

    {#if mensajeExito}
      <p class="mt-5 rounded-lg border border-green-400/30 bg-green-500/10 p-4 text-green-300" role="status">
        {mensajeExito}
      </p>
    {/if}

    <div class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-2xl border border-white/10 bg-[#07122f] p-6">
        <h2 class="text-2xl font-semibold">
          Registrar un hotel
        </h2>

        <p class="mt-2 text-sm text-slate-300">
          Completa los datos para guardar un nuevo hotel en Supabase.
          Se guardará como borrador.
        </p>

        <form onsubmit={registrarHotel} class="mt-6 space-y-5">
          <div>
            <label for="nombre" class="mb-2 block text-sm font-medium">
              Nombre del hotel *
            </label>
            <input
              id="nombre"
              bind:value={nombre}
              required
              maxlength="150"
              placeholder="Ej. Hotel El Alto"
              class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label for="descripcion" class="mb-2 block text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="descripcion"
              bind:value={descripcion}
              maxlength="5000"
              rows="4"
              placeholder="Describe las instalaciones y servicios..."
              class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
            ></textarea>
          </div>

          <div>
            <label for="direccion" class="mb-2 block text-sm font-medium">
              Dirección *
            </label>
            <input
              id="direccion"
              bind:value={direccion}
              required
              maxlength="300"
              placeholder="Zona, calle y número"
              class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label for="ciudad" class="mb-2 block text-sm font-medium">
              Ciudad *
            </label>
            <input
              id="ciudad"
              bind:value={ciudad}
              required
              maxlength="100"
              placeholder="El Alto"
              class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
            />
          </div>

          
            <div>
           <label for="archivoImagen" class="mb-2 block text-sm font-medium">
            Imagen del hotel
           </label>

            <input
            id="archivoImagen"
            type="file"
            accept="image/*"
            onchange={seleccionarImagen}
            class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-fuchsia-500 file:px-3 file:py-2 file:font-semibold file:text-white"
  />

            <p class="mt-2 text-xs text-slate-400">
            Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.
           </p>

            {#if vistaPrevia}
             <img
             src={vistaPrevia}
      alt="Vista previa de la imagen del hotel"
      class="mt-4 h-48 w-full rounded-lg object-cover"
    />
  {/if}
</div>
          

          <div>
            <label for="precio_desde" class="mb-2 block text-sm font-medium">
              Precio desde
            </label>
            <input
              id="precio_desde"
              type="number"
              bind:value={precio_desde}
              min="0"
              max="99999999"
              step="0.01"
              placeholder="Ej. 150"
              class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white outline-none focus:border-fuchsia-400"
            />
            <p class="mt-2 text-xs text-slate-400">
              Introduce el precio en la moneda que utilizarás en tu sitio.
            </p>
          </div>

          <button
            type="submit"
            disabled={guardando}
            class="w-full rounded-lg bg-gradient-to-r from-[#642bd5] to-[#d82bdc] px-5 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? 'Guardando hotel...' : 'Registrar hotel'}
          </button>
        </form>
        <section class="mt-10 rounded-2xl border border-white/10 bg-[#07122f] p-6">
  <h2 class="text-2xl font-semibold">Hoteles registrados</h2>
  
<div class="mb-5">
  <input
    type="search"
    placeholder="Buscar por nombre, ciudad o dirección..."
    bind:value={busquedaHotel}
    class="w-full rounded-xl border border-white/10 bg-[#07122f] px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
  />

  <p class="mt-2 text-sm text-gray-400">
    {hotelesFiltrados.length} hoteles encontrados
  </p>
</div>


    {#if hotelesFiltrados.length === 0}
  <p class="text-gray-400">
    No se encontraron hoteles.
  </p>
  {:else}
    <div class="mt-6 grid gap-4 md:grid-cols-2">
      {#each hotelesFiltrados as hotel (hotel.id)}
        <article class="rounded-xl border border-white/10 bg-[#030a20] p-5">
        

<button
  type="button"
  onclick={() => cambiarPublicacion(hotel)}
  disabled={actualizandoId !== ''}
  class="mt-4 w-full rounded-lg bg-gradient-to-r from-[#642bd5] to-[#d82bdc] px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
>
  {actualizandoId === hotel.id
    ? 'Actualizando...'
    : hotel.esta_publicado
      ? 'Retirar publicación'
      : 'Publicar hotel'}
</button>

          {#if hotel.imagen_url}
            <img
              src={hotel.imagen_url}
              alt={`Imagen de ${hotel.nombre}`}
              class="mb-4 h-44 w-full rounded-lg object-cover"
            />
          {/if}

          <h3 class="text-xl font-semibold">{hotel.nombre}</h3>
          <p class="mt-2 text-slate-300">{hotel.ciudad}</p>
          <p class="mt-1 text-sm text-slate-400">{hotel.direccion}</p>

          {#if hotel.precio_desde != null}
            <p class="mt-3 text-fuchsia-300">
              Precio desde: {hotel.precio_desde}
            </p>
          {/if}

          <p class="mt-3 text-sm">
            Estado:
            {#if hotel.esta_publicado}
              <span class="text-green-300">Publicado</span>
            {:else}
              <span class="text-amber-300">Borrador</span>
            {/if}
          </p>
        </article>
      {/each}
    </div>
  {/if}
</section>
      </section>

      <section class="h-fit rounded-2xl border border-white/10 bg-[#07122f] p-6">
        <h2 class="text-xl font-semibold">Sitio público</h2>
        <p class="mt-2 text-slate-300">
          Consulta cómo se muestran los hoteles publicados a los visitantes.
        </p>

        <a
          href="/#hoteles"
          class="mt-5 inline-block rounded-lg bg-gradient-to-r from-[#642bd5] to-[#d82bdc] px-5 py-3 font-semibold"
        >
          Ver hoteles
        </a>

        <a
          href="/"
          class="ml-4 inline-block text-fuchsia-300 hover:text-fuchsia-200"
        >
          Volver al inicio
        </a>
      </section>
      
<section class="mt-10 rounded-2xl border border-white/10 bg-[#07122f] p-6">
  <h2 class="text-2xl font-semibold">Gestionar hoteles</h2>
  <p class="mt-2 text-sm text-slate-300">
    Consulta tus hoteles y controla cuáles se muestran al público.
  </p>

  {#if hoteles.length === 0}
    <p class="mt-6 text-slate-400">
      Todavía no hay hoteles registrados.
    </p>
  {:else}
    <div class="mt-6 space-y-4">
      {#each hoteles as hotel (hotel.id)}
        <article
          class="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#030a20] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <h3 class="font-semibold">{hotel.nombre}</h3>

            <p class="mt-1 text-sm text-slate-300">
              {hotel.ciudad} · {hotel.direccion}
            </p>

            <p class="mt-2 text-sm">
              Estado:
              {#if hotel.esta_publicado}
                <span class="text-green-300">Publicado</span>
              {:else}
                <span class="text-amber-300">Borrador / oculto</span>
              {/if}
            </p>

            {#if hotel.precio_desde != null}
              <p class="mt-1 text-sm text-slate-400">
                Precio desde: {hotel.precio_desde}
              </p>
            {/if}
          </div>

          <button
            type="button"
            onclick={() => cambiarPublicacion(hotel)}
            disabled={actualizandoId !== ''}
            class="shrink-0 rounded-lg bg-gradient-to-r from-[#642bd5] to-[#d82bdc] px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#if actualizandoId === hotel.id}
              Actualizando...
            {:else if hotel.esta_publicado}
              Ocultar hotel
            {:else}
              Publicar hotel
            {/if}
          </button>
          <button
            type="button"
            onclick={() => abrirEdicion(hotel)}
             disabled={editandoId !== ''}
             class="mt-3 w-full rounded-lg border border-fuchsia-400 px-4 py-3 font-semibold text-fuchsia-300 transition hover:bg-fuchsia-500/10 disabled:opacity-50"
              >
               Editar hotel
              </button>
              
<button
  type="button"
  onclick={() => eliminarHotel(hotel)}
  disabled={eliminandoId === hotel.id}
  class="mt-3 w-full rounded-lg border border-red-500 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
>
  {eliminandoId === hotel.id
    ? 'Eliminando...'
    : 'Eliminar hotel'}
</button>

              
{#if editandoId === hotel.id}
  <form
    onsubmit={guardarEdicion}
    class="mt-5 space-y-4 rounded-xl border border-fuchsia-400/30 bg-[#07122f] p-4"
  >
    <h3 class="text-lg font-semibold text-fuchsia-300">
      Editar información del hotel
    </h3>

    <div>
      <label for={`nombre-${hotel.id}`} class="mb-2 block text-sm">
        Nombre del hotel *
      </label>
      <input
        id={`nombre-${hotel.id}`}
        bind:value={nombreEdicion}
        required
        maxlength="150"
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white"
      />
    </div>

    <div>
      <label for={`descripcion-${hotel.id}`} class="mb-2 block text-sm">
        Descripción
      </label>
      <textarea
        id={`descripcion-${hotel.id}`}
        bind:value={descripcionEdicion}
        maxlength="5000"
        rows="3"
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white"
      ></textarea>
    </div>

    <div>
      <label for={`direccion-${hotel.id}`} class="mb-2 block text-sm">
        Dirección *
      </label>
      <input
        id={`direccion-${hotel.id}`}
        bind:value={direccionEdicion}
        required
        maxlength="300"
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white"
      />
    </div>

    <div>
      <label for={`ciudad-${hotel.id}`} class="mb-2 block text-sm">
        Ciudad *
      </label>
      <input
        id={`ciudad-${hotel.id}`}
        bind:value={ciudadEdicion}
        required
        maxlength="100"
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white"
      />
    </div>

    <div>
      <label for={`precio-${hotel.id}`} class="mb-2 block text-sm">
        Precio desde
      </label>
      <input
        id={`precio-${hotel.id}`}
        type="number"
        bind:value={precioEdicion}
        min="0"
        max="99999999"
        step="0.01"
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-4 py-3 text-white"
      />
    </div>

    <div>
      <label for={`imagen-${hotel.id}`} class="mb-2 block text-sm">
        Cambiar fotografía
      </label>

      <input
        id={`imagen-${hotel.id}`}
        type="file"
        accept="image/*"
        onchange={seleccionarImagenEdicion}
        class="w-full rounded-lg border border-white/15 bg-[#030a20] px-3 py-3 text-white"
      />

      {#if vistaPreviaEdicion}
        <img
          src={vistaPreviaEdicion}
          alt="Vista previa del hotel"
          class="mt-3 h-40 w-full rounded-lg object-cover"
        />
      {/if}
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        type="submit"
        disabled={guardandoEdicion}
        class="flex-1 rounded-lg bg-gradient-to-r from-[#642bd5] to-[#d82bdc] px-4 py-3 font-semibold disabled:opacity-50"
      >
        {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
      </button>

      <button
        type="button"
        onclick={cancelarEdicion}
        disabled={guardandoEdicion}
        class="flex-1 rounded-lg border border-white/20 px-4 py-3 font-semibold hover:bg-white/5"
      >
        Cancelar
      </button>
    </div>
  </form>
{/if}

        </article>
      {/each}
    </div>
  {/if}
</section>

    </div>
  </section>
</main>
