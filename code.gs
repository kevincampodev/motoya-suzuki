const HOJA = "AGENDAWEB";

function doPost(e) {

  const datos = JSON.parse(e.postData.contents);

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
// Verificar si la fecha y la hora ya están ocupadas
  const duracion = obtenerDuracionServicio(datos.servicio);
  const horaFin = calcularHoraFin(datos.hora, duracion);

  if (!horarioDisponible(
    datos.fecha,
    datos.hora,
    duracion
)) {

  return ContentService
    .createTextOutput(JSON.stringify({
      resultado: false,
      mensaje: "Horario ocupado"
    }))
    .setMimeType(ContentService.MimeType.JSON);

}

  hoja.appendRow([
    new Date(),
    datos.nombre,
    datos.apellidos,
    datos.celular,
    datos.correo,
    datos.motocicleta,
    datos.modelo,
    datos.placa,
    datos.servicio,
    datos.fecha,
    datos.hora,
    horaFin,
    duracion,
    datos.observaciones
]);
  MailApp.sendEmail({
    to: "postventa@motoya.co",
    subject: "Nueva cita web MotoYa",
    htmlBody:
      "<h2>Nueva cita</h2>" +
      "<b>Nombre:</b> " + datos.nombre + " " + datos.apellidos + "<br>" +
      "<b>Celular:</b> " + datos.celular + "<br>" +
      "<b>Correo:</b> " + datos.correo + "<br>" +
      "<b>Motocicleta:</b> " + datos.motocicleta + "<br>" +
      "<b>Modelo:</b> " + datos.modelo + "<br>" +
      "<b>Placa:</b> " + datos.placa + "<br>" +
      "<b>Servicio:</b> " + datos.servicio + "<br>" +
      "<b>Fecha:</b> " + datos.fecha + "<br>" +
      "<b>Hora:</b> " + datos.hora + "<br>" +
      "<b>Observaciones:</b><br>" + datos.observaciones
  });

  if (datos.correo) {
    MailApp.sendEmail({
      to: datos.correo,
      subject: "Hemos recibido tu solicitud | MotoYa",
      htmlBody:
        "<h2>Hola " + datos.nombre + "</h2>" +
        "<p>Gracias por confiar en <b>MotoYa Centro de Servicio Suzuki</b>.</p>" +
        "<p>Tu solicitud fue recibida correctamente.</p>" +
        "<p>Muy pronto uno de nuestros asesores se pondrá en contacto contigo.</p>" +
        "<br><b>Equipo MotoYa</b>"
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      resultado: true
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


function doGet(e) {

  const fecha = e.parameter.fecha;

  if (!fecha) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const hoja = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("AGENDAWEB");

  const datos = hoja.getDataRange().getValues();

  const horasOcupadas = [];

  for (let i = 1; i < datos.length; i++) {

    if (datos[i][9] == fecha) {

      horasOcupadas.push(datos[i][10]);

    }

  }

  return ContentService
      .createTextOutput(JSON.stringify(horasOcupadas))
      .setMimeType(ContentService.MimeType.JSON);

}

function obtenerDuracionServicio(servicio) {

  const hojaConfig = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("CONFIGURACION");

  const datos = hojaConfig.getDataRange().getValues();

  for (let i = 0; i < datos.length; i++) {

    if (datos[i][0] == servicio) {

      return Number(datos[i][1]);

    }

  }

  // Si no encuentra el servicio devuelve 30 minutos
  return 30;

}

function calcularHoraFin(horaInicio, duracionMinutos) {

  const partes = horaInicio.split(":");

  const fecha = new Date();

  fecha.setHours(Number(partes[0]));
  fecha.setMinutes(Number(partes[1]));
  fecha.setSeconds(0);

  fecha.setMinutes(fecha.getMinutes() + duracionMinutos);

  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return horas + ":" + minutos;

}

function horarioDisponible(fecha, horaInicio, duracionNueva){

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AGENDAWEB");
  const datos = hoja.getDataRange().getValues();

  const inicioNuevo = convertirMinutos(horaInicio);
  const finNuevo = inicioNuevo + duracionNueva;

  for(let i=1;i<datos.length;i++){

    if(datos[i][9] != fecha) continue;

    const inicioExistente = convertirMinutos(datos[i][10]);
    const finExistente = convertirMinutos(datos[i][11]);

    if(
        inicioNuevo < finExistente &&
        finNuevo > inicioExistente
    ){
        return false;
    }

  }

  return true;

}

function convertirMinutos(hora){

  const partes = hora.split(":");

  return Number(partes[0])*60 + Number(partes[1]);

}