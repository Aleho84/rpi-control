import 'dotenv/config';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import { Server as socketio } from "socket.io";
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import indexRouter from './routes/indexRoutes.js';
import websockets from './config/websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECRET_STRING = 'secretcookiestring';
const TIME_SESSION = 1; //Tiempo en lo que expira una session en horas
const PORT = 80;
const PROTOCOL = http;

const app = express();
const httpServer = http.createServer(app);
const ioServer = new socketio(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS'
}));
app.use(cookieParser(SECRET_STRING));
app.use(session({
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * TIME_SESSION
    },
    secret: SECRET_STRING,
}));

//VIEW
app.set('views', path.join(__dirname, '../src/views/pages'));
app.set('view engine', 'ejs');

// Error handler middleware
app.use(function (err, req, res, next) {
    // solo da detalles del error en modo "development"
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);
    res.render('error');
})

// ROUTES
app.use('/', indexRouter);

// WEBSOKET
websockets(ioServer);

// HTTP SERVER
const portNormalizer = normalizePort(PORT);
app.set('port', portNormalizer);
httpServer.listen(portNormalizer);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

// FUNCTIONS
function normalizePort(val) {
    // normaliza un puerto en un numero, una cadena o un valor falso.
    const port = parseInt(val, 10);

    if (isNaN(port)) { return val }
    if (port >= 0) { return port }
    return false;
};

function onError(error) {
    // event listener para HTTP server cuando devuelve "error"
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof portNormalizer === 'string'
        ? 'Pipe ' + portNormalizer
        : 'Port ' + portNormalizer;

    switch (error.code) {
        case 'EACCES':
            console.log(`[SERVER]: ❌ ${bind} requiere permisos elevados`);
            process.exit(1);
            break
        case 'EADDRINUSE':
            console.log(`[SERVER]: ❌ ${bind} ya esta utilizado`);
            process.exit(1);
            break
        default:
            console.log(`[SERVER]: ❌ Error al conectar: [${error}]`);
            throw error;
    };
};

function onListening() {
    // event listener para HTTP server
    const addr = httpServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`[SERVER]: 💻 Server PROTOCOL: ${PROTOCOL} en PUERTO: ${PORT}. 🪛  Worker PID: ${process.pid}.`);
};