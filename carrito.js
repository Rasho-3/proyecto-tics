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
    { nombre: "Kit Básico", valor: 385, precio: 385, img: "kit_basico.jpg", url: "KitBasico.html" },
    { nombre: "Kit Avanzado", valor: 800, precio: 800, img: "kit_avanzado.jpg", url: "KitAvanzado.html" },
    { nombre: "Kit Profesional", valor: 1200, precio: 1200, img: "kit_profesional.jpg", url: "KitProfesional.html" }
];

// --- VARIABLES DEL CARRITO ---
let carrito = [];
let total = 0;

// --- FUNCION PARA INYECTAR EL CSS ---
function insertarEstilosCarrito() {
  if (document.getElementById('estilos-carrito')) return; // Evita duplicados

  const estilos = `
    #carrito-flotante {
      position: fixed;
      bottom: 100px;
      right: 30px;
      background-color: #1e1e1e;
      color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      width: 350px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 4px 15px rgba(12, 192, 223, 0.9);
      z-index: 1100;
      font-family: Arial, sans-serif;
      display: none;
    }
    #carrito-flotante h3 {
      color: #0cc0df;
      text-align: center;
      margin-bottom: 10px;
    }
    #lista-carrito {
      list-style: none;
      padding: 0;
      margin: 0;
      color: #ccc;
    }
    #lista-carrito li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    #lista-carrito button {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 4px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    #lista-carrito button:hover {
      background-color: #c0392b;
    }
    #carrito-flotante > div strong {
      color: #0cc0df;
      text-align: center;
      display: block;
      margin-top: 10px;
    }
    #carrito-flotante button.vaciar-carrito {
      background-color: #ff9800;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(255, 152, 0, 0.7);
      transition: background-color 0.3s ease;
      margin-top: 15px;
      width: 100%;
      display: block;
      text-align: center;
    }
    #carrito-flotante button.vaciar-carrito:hover {
      background-color: #e68900;
    }
    #icono-carrito {
      position: fixed;
      top: 30px;
      right: 30px;
      background-color: #0cc0df;
      color: white;
      font-size: 24px;
      padding: 14px 16px;
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(12, 192, 223, 0.9);
      cursor: pointer;
      z-index: 1200;
      transition: background-color 0.3s ease, transform 0.2s ease;
      user-select: none;
    }
    #icono-carrito:hover {
      background-color: #09a8c0;
      transform: scale(1.1);
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'estilos-carrito';
  styleTag.textContent = estilos;
  document.head.appendChild(styleTag);
}

// --- FUNCION PARA CREAR EL CARRITO Y EL ICONO ---
function crearCarritoFlotante() {
    if (document.getElementById('carrito-flotante')) return;

    const carritoDiv = document.createElement('div');
    carritoDiv.id = 'carrito-flotante';

    carritoDiv.innerHTML = `
        <h3>Carrito de Compras</h3>
        <ul id="lista-carrito"></ul>
        <div><strong>Total: Q<span id="total-carrito">0</span></strong></div>
        <button class="vaciar-carrito">Vaciar Carrito</button>
    `;

    document.body.appendChild(carritoDiv);

    // Vaciar carrito
    carritoDiv.querySelector('.vaciar-carrito').addEventListener('click', () => {
        carrito = [];
        total = 0;
        actualizarCarrito();
        guardarCarrito();
        carritoDiv.style.display = 'none';
    });

    // Crear ícono carrito si no existe
    if (!document.getElementById('icono-carrito')) {
        const icono = document.createElement('div');
        icono.id = 'icono-carrito';
        icono.title = 'Mostrar/Ocultar carrito';
        icono.textContent = '🛒';
        document.body.appendChild(icono);

        icono.addEventListener('click', () => {
            carritoDiv.style.display = carritoDiv.style.display === 'block' ? 'none' : 'block';
        });
    }
}

// --- FUNCION PARA ACTUALIZAR EL CONTENIDO DEL CARRITO ---
function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total-carrito');
    if (!lista || !totalSpan) return;

    lista.innerHTML = '';
    carrito.forEach((item, index) => {
        const li = document.createElement('li');

        const texto = document.createElement('span');
        texto.textContent = `${item.nombre} x${item.cantidad} (Q${item.valor * item.cantidad})`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
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

// --- FUNCIONES PARA AGREGAR Y ELIMINAR PRODUCTOS ---
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

// --- FUNCIONES PARA GUARDAR Y CARGAR EN LOCALSTORAGE ---
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

// --- BUSCADOR ---
document.addEventListener('DOMContentLoaded', () => {
    insertarEstilosCarrito();
    crearCarritoFlotante();
    cargarCarrito();
    actualizarCarrito();
    asignarEventosComprarUniversal();

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
                    <a href="${p.url}">
                        <img src="${p.img}" alt="${p.nombre}">
                        <h4>${p.nombre}</h4>
                    </a>
                    <p>Q${p.precio} GTQ</p>
                    <button class="btn-comprar" data-nombre="${p.nombre}" data-precio="${p.precio}">Comprar</button>
                `;
                resultados.appendChild(card);
            });
        });
    }
});

// --- LISTENER PARA LOS BOTONES COMPRAR ---
function asignarEventosComprarUniversal() {
    document.body.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const texto = e.target.textContent.trim().toLowerCase();
            if (
                texto.startsWith('comprar kit') ||
                texto.startsWith('comprar')
            ) {
                let nombre = null, valor = null;
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
