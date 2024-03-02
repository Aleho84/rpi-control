// LED TEST CON SALIDAS 
//      GPIO 21  [p36]  OUT
//      GPIO 20  [p38]  OUT
//      GPIO 16  [p40]  OUT

import rpio from 'rpio';
import { exec } from 'child_process';

const _delayOn = 1500;
const _delayOff = 100;
const _temperatureString = 'Temperature: ';

const GPIO = {
    36: 'GPIO 21 [p36]',
    38: 'GPIO 20 [p38]',
    40: 'GPIO 16 [p40]'
}
const colors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    reset: '\x1b[0m'
}

consoleInit();
rpioInit();
const rpiInterval = setInterval(rpiTest, 1000);


function consoleInit() {
    console.clear();
    process.stdout.write('\x1B[?25l');
    console.log('*********************************************************************************************');
    console.log('                                    RPI-CONTROL-TEST                                      ');
    console.log('*********************************************************************************************\n\n');

    process.stdout.moveCursor(0, 2);
    process.stdin.pause();
}

function rpioInit() {
    rpio.open(36, rpio.OUTPUT, rpio.LOW);
    rpio.open(38, rpio.OUTPUT, rpio.LOW);
    rpio.open(40, rpio.OUTPUT, rpio.LOW);
}

function activateGpio(pin) {
    rpio.write(pin, rpio.HIGH);
    printGPIO(pin, rpio.read(pin));
    rpio.msleep(_delayOn);
}

function deactivateGpio(pin) {
    rpio.write(pin, rpio.LOW);
    printGPIO(pin);
    rpio.msleep(_delayOff);
}

async function getRaspberryTemperature() {
    return new Promise((resolve, reject) => {
        exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            const temperature = parseFloat(stdout.trim()) / 1000;
            resolve(temperature.toFixed(1));
        });
    });
}

function printTemperature(value) {
    process.stdout.moveCursor(8, -3);
    console.log(`${_temperatureString} ${value}°C   `);
    process.stdout.moveCursor(0, 2);
    process.stdin.pause();
}

function printGPIO(pin) {

    switch (pin) {
        case 36:
            process.stdout.moveCursor(8, -1);
            break;
        case 38:
            process.stdout.moveCursor(33, -1);
            break;
        case 40:
            process.stdout.moveCursor(58, -1);
            break;
    }

    process.stdin.pause();

    const value = rpio.read(pin);

    if (value) {
        console.log(colors['green'], `${GPIO[pin]}: -ON-  `);
    } else {
        console.log(colors['red'], `${GPIO[pin]}: -OFF-  `);
    }
}

function rpiTest() {
    getRaspberryTemperature()
        .then(temperatura => {
            printTemperature(temperatura);
            //pin36 = GPIO21
            activateGpio(36);
            deactivateGpio(36);

            //pin38 = GPIO20
            activateGpio(38);
            deactivateGpio(38);

            //pin40 = GPIO16
            activateGpio(40);
            deactivateGpio(40);
        })
        .catch(error => console.error(error));
}
