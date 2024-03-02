// IR TEST 
//      GPIO 17  [p11]  IN
//      GPIO 21  [p36]  OUT
//      GPIO 20  [p38]  OUT
//      GPIO 16  [p40]  OUT

import rpio from 'rpio';

// Configuramos los pines a utilizar
const PIN_SENSOR = 11;          //GPIO17
const PIN_VERDE = 36;           //GPIO21
const PIN_AMARILLO = 38;        //GPIO20
const PIN_ROJO = 40;            //GPIO16
const SET_INTERVAL = 1000;
const SET_LED_INTERVAL = 50;

rpio.open(PIN_SENSOR, rpio.INPUT);
rpio.open(PIN_VERDE, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_AMARILLO, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_ROJO, rpio.OUTPUT, rpio.LOW);

let trenPulsos = '';

consoleInit();
rpio.poll(PIN_SENSOR, leerDatos);

setInterval(() => {
    cambiarAmarillo();
    rpio.poll(PIN_SENSOR, null); // Detenemos la lectura    
    const trenLegible = trenPulsos.replace(/0/g, '_').replace(/1/g, '¯');
    if (trenLegible.length > 0) {
        cambiarRojo();
        console.log(`Tren de pulsos: ${trenLegible}`);
        console.log(`                ${trenPulsos}\n`);
        trenPulsos = '';
    }
    rpio.poll(PIN_SENSOR, leerDatos);
}, SET_INTERVAL);

function consoleInit() {
    console.clear();
    console.log('*********************************************************************************************');
    console.log('                                    IR-CONTROL-TEST                                          ');
    console.log('*********************************************************************************************\n\n');
}

// Función para leer los datos del sensor IR
function leerDatos() {
    const value = rpio.read(PIN_SENSOR);
    trenPulsos += value;
}

// Función para encender el led Rojo
function cambiarRojo() {
    rpio.write(PIN_VERDE, rpio.LOW);
    rpio.write(PIN_ROJO, rpio.HIGH);
    setTimeout(() => {
        rpio.write(PIN_VERDE, rpio.HIGH);
        rpio.write(PIN_ROJO, rpio.LOW);
    }, SET_LED_INTERVAL);
}

// Función para encender el led Amarillo
function cambiarAmarillo() {
    rpio.write(PIN_VERDE, rpio.LOW);
    rpio.write(PIN_AMARILLO, rpio.HIGH);
    setTimeout(() => {
        rpio.write(PIN_VERDE, rpio.HIGH);
        rpio.write(PIN_AMARILLO, rpio.LOW);
    }, SET_LED_INTERVAL);
}