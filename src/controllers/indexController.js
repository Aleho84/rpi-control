import packageJson from '../../package.json' assert {type: "json"};
import { raspy } from '../config/websocket.js'

export const getIndexPage = async (req, res) => {
    try {
        res.render('index', { title: packageJson.name.toUpperCase() });
    } catch (error) {
        res.render('error', { message: error.message, error: error });
    };
};

export const getGpioStatus = async (req, res) => {
    try {
        const pinValues = {
            pin36: raspy.readGpio(36),
            pin38: raspy.readGpio(38),
            pin40: raspy.readGpio(40)
        };
        res.status(200).json({
            status: 200,
            message: 'OK',
            pinValues
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            error: error.message
        });
    };
};

export const getSwitchGpio = async (req, res) => {
    try {
        const { pin } = req.query;
        await raspy.switchGpio(pin);

        res.status(200).json({
            status: 200,
            message: 'OK'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    };
}

export const getGpioSetGreen = async (req, res) => {
    try {
        await raspy.activateGpio(36);
        await raspy.deactivateGpio(38);
        await raspy.deactivateGpio(40);

        res.status(200).json({
            status: 200,
            message: 'OK'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    };
}

export const getGpioSetYellow = async (req, res) => {
    try {
        await raspy.deactivateGpio(36);
        await raspy.activateGpio(38);
        await raspy.deactivateGpio(40);

        res.status(200).json({
            status: 200,
            message: 'OK'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    };
}

export const getGpioSetRed = async (req, res) => {
    try {
        await raspy.deactivateGpio(36);
        await raspy.deactivateGpio(38);
        await raspy.activateGpio(40);

        res.status(200).json({
            status: 200,
            message: 'OK'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    };
}
