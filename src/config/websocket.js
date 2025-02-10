import os from 'os';
import { secondsToString, bytesToMegabytes } from '../utils/functions.js';
import { Raspy } from '../modules/rpio-control.js';
export const raspy = new Raspy();

export default (ioServer) => {
    ioServer.on('connection', (socket) => {        
        const socketID = socket.id;
        const clientIP = socket.conn.remoteAddress;

        socket.emit(`server_handshake`);

        socket.on('client_handshake', () => {
            console.log(`[WEBSOKET]:📱 Cliente [${socketID}] conectado IP: ${clientIP}`);
            getRapsyValues()
                .then(raspiData => {
                    socket.emit('server_message', raspiData);
                });
        });

        socket.on('client_message', (data) => {
            if (data) {
                raspy.switchGpio(data.pin);
            } else {
                getRapsyValues()
                    .then(raspiData => {
                        socket.emit('server_message', raspiData);
                    });
            }
        });

        socket.on('disconnect', () => {
            console.log(`[WEBSOKET]:📱 Cliente [${socketID}] desconectado`);
        });
    });
};


// obtener valores de raspberry
async function getRapsyValues() {
    try {
        const raspyValues = {
            temp: await raspy.getRaspyTemp(),
            uptime : secondsToString(os.uptime()),
            freeram : parseInt(bytesToMegabytes(os.freemem())),
            totalram : parseInt(bytesToMegabytes(os.totalmem())),
            pin36: await raspy.readGpio(36),
            pin37: await raspy.readGpio(37),
            pin38: await raspy.readGpio(38),
            pin40: await raspy.readGpio(40),
        };
        return raspyValues;
    } catch (error) {
        console.error(`Error al obtener valores de Raspberry \n ${error}`);
    }
};

// parsea el cookieString del header para obtener los valores de cookies del navegador
function cookieParser(cookieString) {
    const cookies = {};

    try {
        cookieString.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            let key = parts[0].trim();
            if (key === 'connect.sid') { key = 'sid' }
            const value = parts[1].trim();
            cookies[key] = value;
        });
    } catch (error) {
        console.error(`Error al parsear cookies \n coockieString = ${cookieString} \n ${error}`);
    }

    return cookies;
};
