import { Router } from 'express';
const indexRouter = Router();

import {
    getIndexPage,
    getGpioStatus,
    getSwitchGpio,
    getGpioSetGreen,
    getGpioSetYellow,
    getGpioSetRed,
    getBuzzerOn,
    getBuzzerOff,
} from '../controllers/indexController.js';

indexRouter.get('/', getIndexPage);
indexRouter.get('/api/gpio_status', getGpioStatus);
indexRouter.get('/api/switchGpio', getSwitchGpio);
indexRouter.get('/api/gpioSetGreen', getGpioSetGreen);
indexRouter.get('/api/gpioSetYellow', getGpioSetYellow);
indexRouter.get('/api/gpioSetRed', getGpioSetRed);
indexRouter.get('/api/buzzerOn', getBuzzerOn);
indexRouter.get('/api/buzzerOff', getBuzzerOff);

export default indexRouter;
