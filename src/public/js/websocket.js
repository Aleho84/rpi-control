const socket = io();
const label_temp = document.querySelector("#label_temp");
const label_uptime = document.querySelector("#label_uptime");
const label_freeram = document.querySelector("#label_freeram");
const label_totalram = document.querySelector("#label_totalram");
const input_ip = document.querySelector("#input_ip");
const buttons = [
    document.querySelector("#button_g16"),
    document.querySelector("#button_g20"),
    document.querySelector("#button_g21"),
    document.querySelector("#button_g26"),
    document.querySelector("#button_add"),
];

setInterval(function () {
    socket.emit('client_message');
}, 100);

//Socket Events
socket.on('server_handshake', () => {
    socket.emit('client_handshake');
});

socket.on('server_message', (data) => {
    label_temp.textContent = data.temp + '°C';
    label_uptime.textContent = data.uptime;
    label_freeram.textContent = data.freeram + ' MB';
    label_totalram.textContent = data.totalram + ' MB';
    data.pin36 ? setGreen(buttons[0]) : setRed(buttons[0]);
    data.pin38 ? setGreen(buttons[1]) : setRed(buttons[1]);
    data.pin40 ? setGreen(buttons[2]) : setRed(buttons[2]);
    data.pin37 ? setGreen(buttons[3]) : setRed(buttons[3]);
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

buttons[3].addEventListener('click', (event) => {
    (buttons[3].textContent === 'ON') ? setGreen(buttons[3]) : setRed(buttons[3]);
    socket.emit('client_message', { pin: 37 })
})

buttons[4].addEventListener('click', (event) => {
    const addIP = input_ip.value;
    socket.emit('add_ip', { addIP })
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
