//Funcion para pasar los segundos a una cadena string legible (C dias HH:MM:SS)
export const secondsToString = function (seconds) {
    try {
        let days = Math.floor(seconds / 86400);
        let hour = Math.floor((seconds / 3600) % 24);
        hour = (hour < 10) ? '0' + hour : hour;
        let minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10) ? '0' + minute : minute;
        // let second = seconds % 60;
        // second = (second < 10) ? '0' + second.toFixed(0) : second.toFixed(0);
        return days + ' dias ' + hour + ' horas ' + minute + ' minutos.';
    } catch (error) {
        return { error: `${error}` };
    };
};

//Funcion para pasar de Bytes a MegaBytes
export const bytesToMegabytes = function (bytes) {
    try {
        return (bytes / 1024) / 1024;
    } catch (error) {
        return { error: `${error}` };
    };
};

//Funcion para validar si un string es IP
export const isValidIP = function(ipAddress) {
    // Regular expression to match an IPv4 address
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
    // Test the input string against the regular expression
    return ipv4Regex.test(ipAddress);
  };  