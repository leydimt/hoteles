<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>El Alto Hoteles</title>
    <style>
        /* =========================
           CONFIGURACIÓN GENERAL
        ========================= */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }
        .body {
            font-family: Arial, sans-serif;
            background:  #030a20 ;
            color: white;
        }
        .section {
            scroll-margin-top: 100px;
        }
        /* =========================
           ENCABEZADO
        ========================= */
        .header {
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 4%;
            background: #07122f;
            border-bottom: 1px solid #20345c;
            position: sticky;
            top: 0;
            z-index: 1000;}
        /* LOGO */
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo-icono {
            font-size: 45px;
        }
        .logo h1 {
            font-size: 25px;
        }
        .logo h2 {
            font-size: 12px;
            letter-spacing: 5px;
            color: #d946ef;
        }
        .logo p {
            font-size: 11px;
            color: #bfc8df;
            font-style: italic;
        }
        /* =========================
           MENÚ
        ========================= */
        .nav {
            background: #172f63;
            display: flex;
            align-items: center;
            gap: 5px;
            background-color: #0b193b;
            
        }
        .a {
            color: #d8dbea;
            text-decoration: none;
            padding: 15px 15px;
            border-radius: 20px;
            font-size: 14px;
            transition: 0.3s;
        }
        .hover {
            background: #182b56;
            color: white;
        }
        .activo {
            background: linear-gradient(
                135deg,
                #642bd5,
                #d82bdc
            );
            color: white;
            border: 1px solid #e345e9;
            box-shadow: 0 0 15px #d82bdc55;
        }
        /* BOTÓN MENÚ */
        .boton-menu {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #0c1735;
            border: 1px solid #354872;
            color: white;
            font-size: 22px;
            cursor: pointer;
        }
        /* =========================
           SECCIÓN PRINCIPAL
        ========================= */
        .principal {
            min-height: 580px;
            padding: 60px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            background:
                linear-gradient(
                    90deg,
                    rgba(3, 9, 29, 0.98),
                    rgba(4, 15, 43, 0.75),
                    rgba(3, 8, 25, 0.55)
                ),
                url("el-alto.jpg");
            background-size: cover;
            background-position: center;
        }
        /* =========================
           TEXTO
        ========================= */
        .contenido {
            max-width: 850px;
        }
        .pequeno {
            color: #df45e9;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .contenido h2 {
            font-size: 55px;
            line-height: 1.1;
            margin-bottom: 20px;
        }
        .contenido h2 span {
            color: #df3ee7;
        }
        .descripcion {
            color: #d0d5e3;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 8px;
        }
        /* =========================
           BUSCADOR
        ========================= */
        .buscador {
            margin-top: 30px;
            display: flex;
            align-items: stretch;
            background: rgba(7, 17, 43, 0.95);
            border: 1px solid #29436e;
            border-radius: 15px;
            overflow: hidden;
        }
        .campo {
            flex: 1;
            padding: 15px;
            border-right: 1px solid #293d63;
        }
        .campo label {
            display: block;
            font-size: 12px;
            color: #aeb8cf;
            margin-bottom: 7px;
        }
        .campo input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: white;
        }
        /* =========================
           BOTÓN BUSCAR
        ========================= */
        .buscar {
            padding: 0 30px;
            border: none;
            background: linear-gradient(
                135deg,
                #e22bd5,
                #a52fe5
            );
            color: white;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
        }
        .buscar:hover {
            background: #ed42df;
        }
        /* =========================
           CARACTERÍSTICAS
        ========================= */
        .caracteristicas {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }
        .caracteristica {
            padding: 10px 14px;
            border-radius: 9px;
            background: #0b193b;
            border: 1px solid #28416d;
            color: #d5d9e5;
            font-size: 13px;
        }
        /* =========================
           TARJETA
        ========================= */
        
        /* =========================
           SECCIONES
        ========================= */
        .seccion {
            min-height: 400px;
            padding: 70px 8%;
            background: #07122f;
            border-top: 1px solid #172d56;
        }
        .seccion:nth-child(even) {
            background: #050d24;
        }
        .seccion h2 {
            text-align: center;
            color: #df45e9;
            font-size: 35px;
            margin-bottom: 30px;
        }
        .seccion p {
            max-width: 800px;
            margin: 0 auto 20px;
            text-align: center;
            color: #cdd3e3;
            line-height: 1.7;
        }
        /* =========================
           TARJETAS DE INFORMACIÓN
        ========================= */
         /* CONTENEDOR DE LAS TARJETAS */
.tarjetas {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 25px;
    width: 100%;
    max-width: 1200px;
    margin: 35px auto;
    align-items: stretch;
}

/* TARJETAS DE INFORMACIÓN */
.caja {
    width: 100%;
    min-width: 0;
    padding: 18px;
    text-align: center;
    border-radius: 18px;

    background: linear-gradient(
        145deg,
        #102650,
        #0b193b
    );

    border: 1px solid #29436e;

    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);

    transition: transform 0.3s, box-shadow 0.3s;
}

/* EFECTO AL PASAR EL RATÓN */
.caja:hover {
    transform: translateY(-7px);
    box-shadow: 0 10px 25px rgba(217, 56, 230, 0.25);
    border-color: #d946ef;
}

/* IMÁGENES */
.caja img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
}

/* TÍTULO */
.caja h3,
.caja h4 {
    margin: 15px 0;
    color: #e04be9;
    font-size: 21px;
}

/* DESCRIPCIÓN */
.caja p {
    color: #e0e7ff;
    font-size: 14px;
    line-height: 1.7;
    margin: 10px 0;
}

/* BOTÓN DE INFORMACIÓN */
.caja a {
    display: inline-block;
    margin-top: 15px;
    padding: 12px 18px;

    background: linear-gradient(
        135deg,
        #e32bd4,
        #9f35e6
    );

    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: bold;
    transition: 0.3s;
}

.caja a:hover {
    background: #ed42df;
    transform: scale(1.04);
}

/* TABLET: DOS COLUMNAS */
@media (max-width: 900px) {
    .tarjetas {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* CELULAR: UNA COLUMNA */
@media (max-width: 550px) {
    .tarjetas {
        grid-template-columns: 1fr;
    }

    .caja img {
        height: 220px;
    }
}
        /* =========================
           MAPA
        ========================= */
        .mapa {
            width: 90%;
            max-width: 800px;
            height: 250px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #5133bd;
            border-radius: 20px;
            background:
                radial-gradient(
                    circle,
                    #172f63,
                    #07122f
                );
            font-size: 25px;
            color: #d946ef;
        }
        /* =========================
           CONTACTOS
        ========================= */
        .contacto {
            text-align: center;
            font-size: 18px;
            line-height: 2;
        }
        /* =========================
           REGISTRO
        ========================= */
        .registro {
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #0b193b;
            border: 1px solid #7136c9;
            border-radius: 20px;
        }
        .registro input,
        .registro textarea {
            width: 100%;
            margin-bottom: 15px;
            padding: 13px;
            border: 1px solid #29436e;
            border-radius: 8px;
            background: #050d24;
            color: white;
            outline: none;
        }
        .registro button {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(
                135deg,
                #e32bd4,
                #9f35e6
            );
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        /* =========================
           RESPONSIVE
        ========================= */
        @media (max-width: 900px) {
            nav {
                display: center;
            }
            .principal {
                flex-direction: column;
                align-items: flex-start;
                padding: 45px 25px;
            }
            .contenido {
                width: 100%;
            }
            .contenido h2 {
                font-size: 40px;
            }
            .buscador {
                flex-direction: column;
            }
            .campo {
                border-right: none;
                border-bottom: 1px solid #293d63;
            }
            .buscar {
                height: 55px;
            }
            .tarjeta {
                width: 100%;
                max-width: 400px;
                margin: auto;
            }
            .hotel a {
                display: inline-block;
		        margin: 10px 15px;
		        padding: 10px 15px;
		        background:purple;
		        color: white;
		        text-decoration: none;
		        border-radius: 5px;
            }
        }
    </style>
</head>

<body>
    <!-- =========================
         ENCABEZADO
    ========================== -->
    <header>
        <div class="logo">
            <div style="width:100px;">
               <img src="src/routes/imagenes/WhatsApp Image 2026-10-06 at 5.25.56 PM (1).jpeg" alt="">
            </div>

        <!-- MENÚ PULSABLE -->
        <nav> 
            <div class="rounded-full m-8 animate-bounce">
             <a href="#inicio" class="activo">
              Inicio
             </a>
            </div>
            <div class="rounded-full m-8 animate-bounce">
            <a href="#informacion">
                 Información
            </a>
            </div>
            <div class="rounded-full m-8 animate-bounce">
            <a href="#mapa">
                 Mapa
            </a>
            </div>
            <div class="rounded-full m-8 animate-bounce">
            <a href="#comentarios">
                Comentarios
            </a>
            </div>
            <div class="rounded-full m-8 animate-bounce">
            <a href="#horarios">
                 Horarios
            </a>
            </div>
            <div class="rounded-full m-8 animate-bounce">           
            <a href="#contactos">
                Contactos
            </a>
            </div>
        </nav>
<script>
    
</script>
        <button class="boton-menu">
            ☰
        </button>
    </header>
    <!-- =========================
         INICIO
    ========================== -->
    <script>
</script>

    
<div class="login-page">

	<div class="login-box">

		<h1>Hoteles El Alto</h1>

		<p class="subtitle">Iniciar sesión</p>

		<form>
			<label for="email">Correo electrónico</label>
			<input
				type="email"
				id="email"
				placeholder="Ingrese su correo"
			/>

			<label for="password">Contraseña</label>
			<input
				type="password"
				id="password"
				placeholder="Ingrese su contraseña"
			/>

			<div class="remember">
				<input type="checkbox" id="remember" />
				<label for="remember">Recordarme</label>
			</div>

			<button type="submit">Iniciar sesión</button>
		</form>

		<p class="register">
			¿No tienes una cuenta?
			<a href="/registro">Crear cuenta</a>
		</p>

	</div>

</div>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.login-page {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;

		background:
			linear-gradient(
				rgba(202, 121, 121, 0.45),
				rgba(0, 0, 0, 0.45)
			),
			url("src/routes/imagenes/el alto 3.png");

		background-size: cover;
		background-position: center;
	}

	.login-box {
		width: 100%;
		max-width: 400px;
		background: white;
		padding: 40px;
		border-radius: 15px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	}

	h1 {
		text-align: center;
		font-size: 28px;
		color: #1e293b;
		margin-bottom: 8px;
	}

	.subtitle {
		text-align: center;
		color: #64748b;
		margin-bottom: 30px;
		font-size: 18px;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	label {
		font-size: 14px;
		color: #334155;
		margin-bottom: 7px;
	}

	input[type="email"],
	input[type="password"] {
		width: 100%;
		padding: 12px;
		margin-bottom: 18px;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-size: 14px;
		outline: none;
	}

	input[type="email"]:focus,
	input[type="password"]:focus {
		border-color: #2563eb;
	}

	.remember {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 20px;
	}

	.remember label {
		margin: 0;
	}

	.remember input {
		width: 15px;
		height: 15px;
	}

	button {
		padding: 13px;
		border: none;
		border-radius: 8px;
		background: #2563eb;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
	}

	button:hover {
		background: #1d4ed8;
	}

	.register {
		text-align: center;
		margin-top: 25px;
		color: #64748b;
		font-size: 14px;
	}

	.register a {
		color: #2563eb;
		text-decoration: none;
		font-weight: bold;
	}

	.register a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.login-box {
			padding: 30px 20px;
		}

		h1 {
			font-size: 24px;
		}
	}
</style>
    <section class="principal" id="inicio">
        <div class="contenido">
            <p class="pequeno">
                ✦ DESCUBRE HOTELES EN EL ALTO
            </p>
            <h2>
                Impulsa tu hotel.<br>
                Conecta con
                <span>más personas.</span>
            </h2>
            <p class="descripcion">
                La plataforma de El Alto para encontrar,
                comparar y conocer hoteles.
            </p>
            <p class="descripcion">
                Encuentra información clara sobre
                hoteles y sus servicios.
            </p>
            <!-- BUSCADOR -->
            <div class="buscador">
                <div class="campo">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>
                        🔍 ¿Qué hotel estás buscando?
                    </label>
                    <input
                        type="text"
                        placeholder="Nombre del hotel"
                    >
                </div>
                <div class="campo">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>
                        Entrada
                    </label>
                    <input type="date">
                </div>
                <div class="campo">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>
                        Salida
                    </label>
                    <input type="date">
                </div>
                <a href="#hoteles" class="buscar">
                    Buscar →
                </a>
            </div>
            <!-- CARACTERÍSTICAS -->
            <div class="caracteristicas">
                <div class="caracteristica">
                    Mejores precios
                </div>
                <div class="caracteristica">
                     Reservas seguras
                </div>
                <div class="caracteristica">
                    Opiniones reales
                </div>
                <div class="caracteristica">
                    Atención 24/7
                </div>
            </div>
        </div>
        <!-- TARJETA -->
        <div class="tarjeta">
            <div class="grafico">
            </div>
            <h3>
                Haz que tu hotel
                sea más popular
            </h3>
            <p>
                Registra tu hotel para mostrar
                información a los visitantes.
            </p>
            <a href="#registro">
                Registra tu hotel
            </a>
        </div>

    </section>
    <!-- =========================
         HOTELES
    ========================== -->
    <section class="seccion" id="hoteles">
        <h2>🏨 Hoteles destacados</h2>
        <p>
            Conoce algunos de los hoteles disponibles
            en la ciudad de El Alto.
        </p>
        <!-- Hotel 1 -->
		<div class="hotel ">
        <div class="caja">
			<img
				src="src/routes/imagenes/WhatsApp Image 2026-10-11 at 10.15.03 PM.jpeg"
				alt="Hotel"
			>

			<h4>Hotel Alexander</h4>

			<p> Ciudad de El Alto</p>

			<p>Habitaciones cómodas y atención para nuestros visitantes.</p>

			<a href="/hotel-1">Ver información</a>
                 <article
                class="hotel">
                    <h3>1. Alexander Palace Hotel</h3>
                    <p><strong>Dirección:</strong> Avenida Jorge Carrasco, esquina calle 3, zona 12 de Octubre.</p>
                    <p><strong>Teléfono:</strong> 2823376 / 77710206.</p>
                    <p><strong>Habitaciones:</strong> Simples, dobles, triples, matrimoniales, ejecutivas y suites.</p>
                    <p><strong>Servicios:</strong> Baño privado, agua caliente, televisión por cable, Wi-Fi, desayuno y garaje.</p>
                    <p><strong>Precios:</strong> Consultar con el hotel.</p>
                </article>

            
        </div>
        <!-- Hotel 2-->
		<div class="hotel">
        <div class="caja">
			<img
				src="src/routes/imagenes/WhatsApp Image 2026-10-11 at 10.16.29 PM.jpeg"
				alt="Hotel"
			>

			<h4>Hotel Aurum</h4>

			<p> Ciudad de El Alto</p>

			<p>Habitaciones cómodas y atención para nuestros visitantes.</p>

			<a href="/hotel-1">Ver información</a>
        <!-- HOTEL AURUM - HTML -->
<section class="hotel">
    <h2>Hotel Aurum</h2>

    <p><strong>Dirección:</strong> Avenida Alfonso Ugarte N.º 877, edificio Torre Dubái, El Alto, La Paz, Bolivia.</p>

    <p><strong>Teléfono:</strong> 77735955</p>

    <p><strong>Habitaciones:</strong> Habitaciones privadas; consultar disponibilidad y tipos.</p>

    <p><strong>Servicios:</strong></p>
    <ul>
        <li>Wi-Fi</li>
        <li>Baño privado con ducha</li>
        <li>Televisión</li>
        <li>Recepción</li>
        <li>Servicio a la habitación</li>
        <li>Desayuno, según la tarifa</li>
    </ul>

    <p><strong>Precio:</strong> Consultar directamente con el hotel.</p>

    <p><strong>Ubicación:</strong> Zona de la avenida Alfonso Ugarte, cerca de la zona 16 de Julio.</p>

    <p class="nota">Nota: confirmar directamente con el establecimiento los servicios, precios y datos de contacto actuales.</p>
</section>
        </div>
       <!-- Hotel 3-->
		<div class="hotel">
        <div class="caja">
			<img
				src="src/routes/imagenes/WhatsApp Image 2026-10-11 at 10.15.00 PM.jpeg"
				alt="Hotel"
			>

			<h4>Hotel golden</h4>

			<p> Ciudad de El Alto</p>

			<p>Habitaciones cómodas y atención para nuestros visitantes.</p>

			<a href="/hotel-1">Ver información</a>
        </div>
            <!-- Hotel 4-->
		<div class="hotel">
        <div class="caja">
			<img
				src="src/routes/imagenes/WhatsApp Image 2026-10-11 at 10.15.01 PM.jpeg"
				alt="Hotel"
			>

			<h4>Hotel MILAN</h4>

			<p> Ciudad de El Alto</p>

			<p>Habitaciones cómodas y atención para nuestros visitantes.</p>

			<a href="/hotel-1">Ver información</a>
        </div>
        <!-- Hotel 5-->
		<div class="hotel">
        <div class="caja">
			<img
				src="src/routes/imagenes/WhatsApp Image 2026-10-11 at 10.15.00 PM.jpeg"
				alt="Hotel"
			>

			<h4>Hotel diamante</h4>

			<p> Ciudad de El Alto</p>

			<p>Habitaciones cómodas y atención para nuestros visitantes.</p>

			<a href="/hotel-1">Ver información</a>
            <!-- HOTEL GOLDEN - HTML -->
<section class="hotel">
    <h2>Hotel Golden</h2>

    <p><strong>Dirección:</strong> Avenida Alfonso Ugarte N.º 50, El Alto, La Paz, Bolivia.</p>

    <p><strong>Teléfono:</strong> No confirmado.</p>

    <p><strong>Habitaciones:</strong> Habitaciones para huéspedes; consultar disponibilidad y tipos.</p>

    <p><strong>Servicios:</strong></p>
    <ul>
        <li>Wi-Fi</li>
        <li>Recepción las 24 horas</li>
        <li>Servicio de desayuno</li>
        <li>Alojamiento para huéspedes</li>
    </ul>

    <p><strong>Precio:</strong> Consultar directamente con el hotel.</p>

    <p><strong>Ubicación:</strong> Avenida Alfonso Ugarte, ciudad de El Alto, departamento de La Paz.</p>

    <p class="nota">
        Nota: confirmar directamente con el establecimiento
        los servicios, precios, dirección y datos de contacto actuales.
    </p>
</section>
</div>
             
        </div>

    </section>



    <!-- =========================
         INFORMACIÓN
    ========================== -->

    <section class="seccion" id="informacion">

        <h2>Información</h2>
        <img src="src/routes/imagenes/el alto 3.png" alt="">
        <p>
            en esta aplicacion web podras tener unma variedad de hoteles de la ciudad del alto 
        </p>

        <p>
            El Alto Hoteles es una aplicación web
            creada para facilitar la búsqueda de
            información sobre hoteles de la ciudad
            de El Alto.
        </p>

        <p>
            Los visitantes podrán conocer la ubicación,
            servicios, horarios y opiniones de diferentes
            hoteles.
        </p>

    </section>



    <!-- =========================
         MAPA
    ========================== -->

    <section class="seccion" id="mapa">

        <h2>Mapa de hoteles</h2>

        <div class="mapa">
        
         <iframe src="https://maps.google.com/maps?q=El%20Alto%2C%20Bolivia&output=embed" frameborder="0"></iframe>

        </div>
    </section>



    <!-- =========================
         COMENTARIOS
    ========================== -->

    <section class="seccion" id="comentarios">

        <h2>💬 Comentarios</h2>

        <p>
            Aquí los visitantes podrán conocer
            las opiniones de otros usuarios sobre
            los hoteles.
        </p>

        <div class="tarjetas">

            <div class="caja">
                ⭐⭐⭐⭐⭐
                <h3>María</h3>
                <p>
                    Buena atención y habitaciones cómodas.
                </p>
            </div>

            <div class="caja">
                ⭐⭐⭐⭐
                <h3>Carlos</h3>
                <p>
                    Buen precio y excelente ubicación.
                </p>
            </div>

        </div>

    </section>



    <!-- =========================
         HORARIOS
    ========================== -->

    <section class="seccion" id="horarios">

        <h2>🕐 Horarios y servicios</h2>

        <div class="tarjetas">

            <div class="caja">
                🕐
                <h3>Recepción</h3>
                <p>
                    Atención las 24 horas.
                </p>
            </div>

            <div class="caja">
                🍽️
                <h3>Desayuno</h3>
                <p>
                    Servicio de desayuno.
                </p>
            </div>

            <div class="caja">
                📶
                <h3>Wi-Fi</h3>
                <p>
                    Internet disponible.
                </p>
            </div>

        </div>

    </section>



    <!-- =========================
         CONTACTOS
    ========================== -->

    <section class="seccion" id="contactos">

        <h2>📞 Contactos</h2>

        <div class="contacto">

            📱 Teléfono: 70000000
            <br>

            💬 WhatsApp: 70000000
            <br>

            ✉️ Email: contacto@elaltohoteles.com
            <br>

            📍 Ciudad de El Alto, La Paz - Bolivia

        </div>

    </section>



    <!-- =========================
         REGISTRAR HOTEL
    ========================== -->

    <section class="seccion" id="registro">

        <h2>🏨 Registra tu hotel</h2>

        <div class="registro">

            <input
                type="text"
                placeholder="Nombre del hotel"
            >

            <input
                type="text"
                placeholder="Dirección"
            >

            <input
                type="text"
                placeholder="Teléfono"
            >

            <input
                type="email"
                placeholder="Correo electrónico"
            >

            <textarea
                rows="5"
                placeholder="Descripción del hotel"
            ></textarea>

            <button type="button">
                Registrar hotel
            </button>

        </div>

    </section>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="login.js"></script>

</body>

</html>