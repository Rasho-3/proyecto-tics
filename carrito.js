// --- PRODUCTOS Y CATÁLOGO ---
const productos = [
    { nombre: "L298N", valor: 60, precio: 60, img: "l298n.jpg", url: "L298N.html" },
    { nombre: "Arduino Uno", valor: 150, precio: 150, img: "arduino_uno.jpg", url: "ArduinoUno.html" },
    { nombre: "Motor N20", valor: 80, precio: 80, img: "motores_n20.jpg", url: "MotoresN20.html" },
    { nombre: "Jumpers", valor: 70, precio: 70, img: "jumpers.jpg", url: "Jumpers.html" },
    { nombre: "Sensor Ultrasónico", valor: 120, precio: 120, img: "sensor_ultrasonico.jpg", url: "SensorUltrasonico.html" },
    { nombre: "Llantas", valor: 90, precio: 90, img: "llantas_carrito.jpg", url: "Llantas.html" },
    { nombre: "Motorreductores", valor: 20, precio: 20, img: "motorreductores_amarillos.jpg", url: "Motorreductores.html" },
    { nombre: "Arduino Nano", valor: 125, precio: 125, img: "arduino_nano.jpg", url: "ArduinoNano.html" },
    { nombre: "ESP-32", valor: 450, precio: 450, img: "esp32.jpg", url: "ESP32.html" },
    { nombre: "L293D", valor: 20, precio: 20, img: "l293d.jpg", url: "L293D.html" },
    { nombre: "Sensor de Luz", valor: 35, precio: 35, img: "sensor_luz.jpg", url: "SensorLuz.html" },
    // Puedes añadir tus kits aquí si deseas buscarlos también...
    { nombre: "Kit Básico", valor: 385, precio: 385, img: "kit_basico.jpg", url: "KitBasico.html" },
    { nombre: "Kit Avanzado", valor: 800, precio: 800, img: "kit_avanzado.jpg", url: "KitAvanzado.html" },
    { nombre: "Kit Profesional", valor: 1200, precio: 1200, img: "kit_profesional.jpg", url: "KitProfesional.html" }
];

// --- CARRITO JS (INTEGRADO) ---
let carrito = [];
let total = 0;

// Carrito flotante ESQUINA INFERIOR DERECHA
function crearCarritoFlotante() {
    if (document.getElementById('carrito-flotante')) return;
    const carritoDiv = document.createElement('div');
    carritoDiv.id = 'carrito-flotante';
    carritoDiv.style.position = 'fixed';
    carritoDiv.style.bottom = '10px';
    carritoDiv.style.right = '20px';
    carritoDiv.style.left = 'unset';
    carritoDiv.style.transform = 'unset';
    carritoDiv.style.backgroundColor = 'white';
    carritoDiv.style.border = '1px solid #ccc';
    carritoDiv.style.borderRadius = '8px';
    carritoDiv.style.padding = '10px 20px';
    carritoDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    carritoDiv.style.zIndex = '1000';
    carritoDiv.style.maxWidth = '400px';
    carritoDiv.style.width = '90%';
    carritoDiv.style.fontFamily = 'Arial, sans-serif';

    carritoDiv.innerHTML = `
        <h3 style="margin:0 0 10px 0; font-size:1.2em;">Carrito de Compras</h3>
        <ul id="lista-carrito" style="list-style:none; padding-left:0; max-height:150px; overflow-y:auto; margin-bottom:10px;"></ul>
        <div><strong>Total: Q<span id="total-carrito">0</span></strong></div>
    `;
    document.body.appendChild(carritoDiv);
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total-carrito');
    if (!lista || !totalSpan) return;

    lista.innerHTML = '';
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '6px';

        const texto = document.createElement('span');
        texto.textContent = `${item.nombre} x${item.cantidad} (Q${item.valor * item.cantidad})`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.style.marginLeft = '10px';
        btnEliminar.style.backgroundColor = '#e74c3c';
        btnEliminar.style.color = 'white';
        btnEliminar.style.border = 'none';
        btnEliminar.style.borderRadius = '4px';
        btnEliminar.style.padding = '2px 6px';
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.title = `Eliminar ${item.nombre} del carrito`;

        btnEliminar.addEventListener('click', () => {
            eliminarProducto(index);
        });

        li.appendChild(texto);
        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });

    totalSpan.textContent = total;
}

function agregarAlCarrito(nombre, valor) {
    const productoExistente = carrito.find(p => p.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, valor, cantidad: 1 });
    }
    total += valor;
    actualizarCarrito();
    guardarCarrito();
}

function eliminarProducto(indice) {
    if (indice < 0 || indice >= carrito.length) return;
    const producto = carrito[indice];
    total -= producto.valor * producto.cantidad;
    carrito.splice(indice, 1);
    actualizarCarrito();
    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', total.toString());
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    const totalGuardado = localStorage.getItem('total');
    if (carritoGuardado) carrito = JSON.parse(carritoGuardado);
    if (totalGuardado) total = parseInt(totalGuardado, 10);
}

// --- BUSCADOR JS (INTEGRADO) ---
// Puedes poner esto dentro de DOMContentLoaded o dejarlo directo si tus elementos están ya en el HTML
document.addEventListener('DOMContentLoaded', () => {
    crearCarritoFlotante();
    cargarCarrito();
    actualizarCarrito();
    asignarEventosComprarUniversal();

    // --- Buscador dinámico de productos en index ---
    const input = document.getElementById("buscar-producto");
    const resultados = document.getElementById("resultados-busqueda");
    const mensajeNo = document.getElementById("no-resultados");

    if (input) {
        input.addEventListener("input", function() {
            const texto = input.value.trim().toLowerCase();
            resultados.innerHTML = "";
            if (mensajeNo) mensajeNo.style.display = "none";
            if (texto === "") return;

            const encontrados = productos.filter(p =>
                p.nombre.toLowerCase().includes(texto)
            );

            if (encontrados.length === 0) {
                if (mensajeNo) mensajeNo.style.display = "block";
                return;
            }

            encontrados.forEach(p => {
                const card = document.createElement("div");
                card.className = "card-busqueda";
                card.innerHTML = `
                    <a href="${p.url}" style="text-decoration:none;color:inherit;">
                        <img src="${p.img}" alt="${p.nombre}">
                        <h4>${p.nombre}</h4>
                    </a>
                    <p>Q${p.precio} GTQ</p>
                    <button class="btn-comprar" data-nombre="${p.nombre}" data-precio="${p.precio}">Comprar</button>
                    <a href="${p.url}" style="display:inline-block;margin-top:5px;color:#1976d2;text-decoration:underline;font-size:.98em;">Ver más</a>
                `;
                resultados.appendChild(card);
            });
        });
    }
});

// Listener universal para todos los botones de compra, productos y kits
function asignarEventosComprarUniversal() {
    document.body.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const texto = e.target.textContent.trim().toLowerCase();
            if (
                texto.startsWith('comprar kit') ||
                texto.startsWith('comprar')
            ) {
                let nombre = null, valor = null;
                // PRIORIDAD: data-nombre/data-precio
                if (e.target.dataset && e.target.dataset.nombre && e.target.dataset.precio) {
                    nombre = e.target.dataset.nombre;
                    valor = parseInt(e.target.dataset.precio, 10);
                }
                if (!nombre || isNaN(valor)) {
                    const match = e.target.textContent.trim().match(/^comprar(?:\s*kit)?\s*(.+)?$/i);
                    if (match && match[1]) {
                        const nombreBuscado = match[1].trim().toLowerCase();
                        const producto = productos.find(p => p.nombre.toLowerCase() === nombreBuscado);
                        if (producto) {
                            nombre = producto.nombre;
                            valor = producto.valor;
                        }
                    }
                }
                if (nombre && !isNaN(valor)) {
                    agregarAlCarrito(nombre, valor);
                } else {
                    alert('No se pudo detectar el nombre o precio del producto.');
                }
            }
        }
    });
}
