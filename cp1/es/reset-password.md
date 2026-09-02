## Reset de contraseña

- Código de verificación: aleatorio, expira a los 15 minutos, se puede usar una sola vez.
- Si el email no existe: responder igual que si existiera (no revelar qué cuentas hay).
- Límite: máximo 3 solicitudes por email cada 15 minutos.
- Guardar cada intento en un log (email, fecha, IP) para poder revisarlo después.
- Al usar el código, invalidar cualquier otro código pendiente de ese usuario.
