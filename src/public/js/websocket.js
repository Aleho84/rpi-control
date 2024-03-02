const socket = io();
const label_temp = document.querySelector("#label_temp");
const buttons = [
    document.querySelector("#button_g16"),
    document.querySelector("#button_g20"),
    document.querySelector("#button_g21"),
];

setInterval(function () {
    socket.emit('client_message');
}, 500);

//Socket Events
socket.on('server_handshake', () => {
    socket.emit('client_handshake');
});

socket.on('server_message', (data) => {
    label_temp.textContent = data.temp + '°C';
    data.pin36 ? setGreen(buttons[0]) : setRed(buttons[0]);
    data.pin38 ? setGreen(buttons[1]) : setRed(buttons[1]);
    data.pin40 ? setGreen(buttons[2]) : setRed(buttons[2]);
});

//Event Listeners
buttons[0].addEventListener('click', (event) => {
    (buttons[0].textContent === 'ON') ? setGreen(buttons[0]) : setRed(buttons[0]);
    socket.emit('client_message', { pin: 36 })
})

buttons[1].addEventListener('click', (event) => {
    (buttons[1].textContent === 'ON') ? setGreen(buttons[1]) : setRed(buttons[1]);
    socket.emit('client_message', { pin: 38 })
})

buttons[2].addEventListener('click', (event) => {
    (buttons[2].textContent === 'ON') ? setGreen(buttons[2]) : setRed(buttons[2]);
    socket.emit('client_message', { pin: 40 })
})

// Helpers
function setGreen(button) {
    try {
        button.classList.remove('red');
        button.classList.add('green');
        button.textContent = 'ON';
    } catch (error) {
        console.log(`Error al cambiar el color del boton \n ${error}`);
    }
};

function setRed(button) {
    try {
        button.classList.remove('green');
        button.classList.add('red');
        button.textContent = 'OFF';
    } catch (error) {
        console.log(`Error al cambiar el color del boton \n ${error}`);
    }
};
