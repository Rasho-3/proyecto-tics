let carrito = [];
let total = 0;

function crearElementosCarritoYBoton() {
  // Crear botón carrito
  const botonCarrito = document.createElement('button');
  botonCarrito.id = 'icono-carrito';
  botonCarrito.title = 'Ver carrito';
  botonCarrito.textContent = '🛒';

  // Contador dentro del botón
  const contador = document.createElement('span');
  contador.id = 'contador-carrito';
  contador.textContent = '0';
  botonCarrito.appendChild(contador);

  // Estilos inline para botón carrito
  Object.assign(botonCarrito.style, {
    position: 'fixed',
    top: '30px',
    right: '30px',
    backgroundColor: '#00eaff',
    borderRadius: '50%',
    border: 'none',
    fontSize: '24px',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    boxShadow: '0 2px 20px #00eaff55',
    zIndex: '1000',
  });

  document.body.appendChild(botonCarrito);

  // Crear carrito flotante
  const carritoDiv = document.createElement('div');
  carritoDiv.id = 'carrito-flotante';
  carritoDiv.style.cssText = `
    position: fixed;
    top: 90px;
    right: 30px;
    background: #222;
    color: #fff;
    border: 2px solid #00eaff;
    box-shadow: 0 0 18px #00eaff33;
    border-radius: 10px;
    width: 300px;
    padding: 18px;
    display: none;
    z-index: 1100;
  `;

  carritoDiv.innerHTML = `
    <h2>Carrito</h2>
    <ul id="carrito-lista" style="padding-left: 18px; max-height: 300px; overflow-y: auto;"></ul>
    <p id="carrito-total"></p>
    <button class="vaciar-carrito">Vaciar carrito</button>
  `;

  document.body.appendChild(carritoDiv);

  // Evento vaciar carrito
  carritoDiv.querySelector('.vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    total = 0;
    actualizarCarrito();
    carritoDiv.style.display = 'none';
  });

  // Mostrar/ocultar carrito al clickear el botón
  botonCarrito.addEventListener('click', () => {
    carritoDiv.style.display = carritoDiv.style.display === 'block' ? 'none' : 'block';
    if (carritoDiv.style.display === 'block') actualizarCarrito();
  });
}

function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  const totalElem = document.getElementById('carrito-total');
  const contador = document.getElementById('contador-carrito');

  lista.innerHTML = '';
  let sumaTotal = 0;

  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = ${item.nombre} x${item.cantidad} = Q${item.precio * item.cantidad} GTQ;
    lista.appendChild(li);
    sumaTotal += item.precio * item.cantidad;
  });

  contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  totalElem.textContent = 'Total: Q' + sumaTotal + ' GTQ';
}

function asignarEventosComprar() {
  document.querySelectorAll('.comprar-btn').forEach(btn => {
    btn.onclick = () => {
      const productoElem = btn.closest('.producto');
      const nombre = productoElem.querySelector('h3').textContent.trim();
      const precioTexto = productoElem.querySelector('.precio').textContent;
      const precio = Number(precioTexto.match(/\d+/)[0]);

      const itemExistente = carrito.find(item => item.nombre === nombre);
      if (itemExistente) {
        itemExistente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      actualizarCarrito();
    };
  });
}

// Función búsqueda productos
function buscarProductos() {
  const query = document.getElementById("input-busqueda").value.toLowerCase();
  document.querySelectorAll(".producto").forEach(producto => {
    const texto = producto.textContent.toLowerCase();
    producto.style.display = texto.includes(query) ? "flex" : "none";
  });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  crearElementosCarritoYBoton();
  asignarEventosComprar();
});
