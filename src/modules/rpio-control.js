import rpio from 'rpio';
import { exec } from 'child_process';

export class Raspy {
    constructor() {
        this.rpioInit();
        this._rpioValues = {
            pin36: false,
            pin37: false,
            pin38: false,
            pin40: false
        };
        this.intervalBuzzer = null;
    }

    get rpioValues() {
        return this._rpioValues;
    }

    getRaspyTemp() {
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

    rpioInit() {
        try {
            rpio.open(36, rpio.OUTPUT, rpio.LOW);
            rpio.open(38, rpio.OUTPUT, rpio.LOW);
            rpio.open(37, rpio.OUTPUT, rpio.LOW);
            rpio.open(40, rpio.OUTPUT, rpio.LOW);
        } catch (error) {
            return { error };
        }
    };

    switchGpio(pin) {
        try {
            pin = Number(pin);
            const pinValid = [36, 37, 38, 40];
            if (!pinValid.includes(pin)) throw Error(`Invalid GPIO Pin ${pin}`);

            switch (pin) {
                case 36:
                    this._rpioValues.pin36 = !this._rpioValues.pin36;
                    if (this._rpioValues.pin36) {
                        rpio.write(pin, rpio.HIGH);
                    } else {
                        rpio.write(pin, rpio.LOW);
                    }
                    break;

                case 37:
                    this._rpioValues.pin37 = !this._rpioValues.pin37;
                    if (this._rpioValues.pin37) {
                        rpio.write(pin, rpio.HIGH);
                    } else {
                        rpio.write(pin, rpio.LOW);
                    }
                    break;

                case 38:
                    this._rpioValues.pin38 = !this._rpioValues.pin38;
                    if (this._rpioValues.pin38) {
                        rpio.write(pin, rpio.HIGH);
                    } else {
                        rpio.write(pin, rpio.LOW);
                    }
                    break;

                case 40:
                    this._rpioValues.pin40 = !this._rpioValues.pin40;
                    if (this._rpioValues.pin40) {
                        rpio.write(pin, rpio.HIGH);
                    } else {
                        rpio.write(pin, rpio.LOW);
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            return { error };
        }
    }

    activateGpio(pin) {
        try {
            const pinValid = [36, 37, 38, 40];
            if (!pinValid.includes(pin)) throw Error(`Invalid GPIO Pin ${pin}`);
            rpio.write(pin, rpio.HIGH);

        } catch (error) {
            return { error };
        }
    }

    deactivateGpio(pin) {
        try {
            const pinValid = [36, 37, 38, 40];
            if (!pinValid.includes(pin)) throw Error(`Invalid GPIO Pin ${pin}`);
            rpio.write(pin, rpio.LOW);

        } catch (error) {
            return { error };
        }
    }

    readGpio(pin) {
        try {
            const pinValid = [36, 37, 38, 40];
            if (!pinValid.includes(pin)) throw Error(`Invalid GPIO Pin ${pin}`);
            const lectura = rpio.read(pin);
            return lectura;
        } catch (error) {
            return { error };
        }
    }

    async buzzerStartBeep() {
        try {
            this.buzzerStopBeep()
                .then(() => {
                    this.intervalBuzzer = setInterval(() => {
                        rpio.write(37, rpio.HIGH);
                        setTimeout(() => {
                            rpio.write(37, rpio.LOW);
                        }, 100);
                    }, 5000);
                });
        } catch (error) {
            return { error };
        }
    }

    async buzzerStopBeep() {
        try {
            clearInterval(this.intervalBuzzer);
        } catch (error) {
            return { error };
        }
    }
}
