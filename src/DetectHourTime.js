function DetectHourTime() {
    const horaActual = new Date().getHours();
  
    if (horaActual >= 5 && horaActual < 12) {
      return "mañana"; // De 5:00 AM a 11:59 AM
    } else if (horaActual >= 12 && horaActual < 18) {
      return "tarde"; // De 12:00 PM a 5:59 PM
    } else {
      return "noche"; // De 6:00 PM a 4:59 AM
    }
  }

  export {DetectHourTime}; // Exporta la función para poder importarla en otro archivo