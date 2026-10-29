
export function crearCorreoInterno(nombreUsuario) {
  const usuarioNormalizado = nombreUsuario.trim().toLowerCase();

  return `${usuarioNormalizado}@usuarios.elaltohoteles.invalid`;
}
