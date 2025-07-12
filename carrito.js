const productos = [
  { nombre: "L298N", valor: 60 },
  { nombre: "Arduino Uno", valor: 150 },
  { nombre: "Motor N20", valor: 80 },
  { nombre: "Jumpers", valor: 70 },
  { nombre: "Sensor Ultrasónico", valor: 120 },
  { nombre: "Llantas", valor: 90 },
  { nombre: "Motorreductores", valor: 20 },
  { nombre: "Arduino Nano", valor: 125 },
  { nombre: "ESP-32", valor: 450 },
  { nombre: "L293D", valor: 20 },
  { nombre: "Sensor de Luz", valor: 35 }
];

let carrito = [];
let total = 0;

function crearElementosCarritoYBoton() {
  // Crear botón carrito
  const botonCarrito = document.createElement('button');
  botonCarrito.id = 'icono-carrito';
  botonCarrito.title = 'Ver carrito';

  // Estilos inline para el botón
  Object.assign(botonCarrito.style, {
    position: 'fixed',
    top: '30px',
    right: '30px',
    backgroundColor: '#0cc0df',
    color: 'white',
    fontSize: '24px',
    padding: '14px 16px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    zIndex: '1200',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(12,192,223,0.9)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    width: '50px',
    height: '50px',
    position: 'fixed',
  });

  botonCarrito.textContent = '🛒';

  // Crear contador dentro del botón
  const contador = document.createElement('span');
  contador.id = 'contador-carrito';

  Object.assign(contador.style, {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '14px',
    borderRadius: '50%',
    padding: '2px 6px',
    position: 'absolute',
    top: '22px',
    right: '22px',
    fontWeight: 'bold',
  });

  contador.textContent = '0';

  botonCarrito.appendChild(contador);
  document.body.appendChild(botonCarrito);

  // Crear carrito flotante
  const carritoDiv = document.createElement('div');
  carritoDiv.id = 'carrito-flotante';

  Object.assign(carritoDiv.style, {
    position: 'fixed',
    top: '70px',
    right: '30px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    width: '350px',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(12,192,223,0.9)',
    zIndex: '1100',
    fontFamily: 'Arial, sans-serif',
    display: 'none',
  });

  carritoDiv.innerHTML = `
    <h3 style="color:#0cc0df; text-align:center; margin-bottom:10px;">Carrito de Compras</h3>
    <ul id="lista-carrito" style="list-style:none; padding:0; margin:0; color:#ccc;"></ul>
    <div><strong style="color:#0cc0df; text-align:center; display:block; margin-top:10px;">
      Total: Q<span id="total-carrito">0</span>
    </strong></div>
    <button class="vaciar-carrito" style="
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
    ">Vaciar Carrito</button>
  `;

  document.body.appendChild(carritoDiv);

  // Evento para vaciar carrito
  carritoDiv.querySelector('.vaciar-carrito').addEventListener('click', () => {
    carrito = [];
    total = 0;
    actualizarCarrito();
    actualizarContadorCarrito();
    guardarCarrito();
    carritoDiv.style.display = 'none';
  });

  // Evento para mostrar/ocultar carrito al clickear ícono
  botonCarrito.addEventListener('click', () => {
    carritoDiv.style.display = carritoDiv.style.display === 'block' ? 'none' : 'block';
    if (carritoDiv.style.display === 'block') actualizarCarrito();
  });
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
    btnEliminar.title = `Eliminar ${item.nombre} del carrito`;
    btnEliminar.style.backgroundColor = '#e74c3c';
    btnEliminar.style.color = 'white';
    btnEliminar.style.border = 'none';
    btnEliminar.style.borderRadius = '4px';
    btnEliminar.style.padding = '2px 6px';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.style.fontWeight = 'bold';
    btnEliminar.style.marginLeft = '10px';

    btnEliminar.addEventListener('click', () => {
      eliminarProducto(index);
    });

    li.appendChild(texto);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  totalSpan.textContent = total;
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('contador-carrito');
  let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (contador) {
    contador.textContent = totalItems;
  }
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
  actualizarContadorCarrito();
  guardarCarrito();
}

function eliminarProducto(indice) {
  if (indice < 0 || indice >= carrito.length) return;

  const producto = carrito[indice];
  total -= producto.valor * producto.cantidad;

  carrito.splice(indice, 1);

  actualizarCarrito();
  actualizarContadorCarrito();
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('total', total.toString());
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  const totalGuardado = localStorage.getItem('total');

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  if (totalGuardado) {
    total = parseInt(totalGuardado, 10);
  }
  actualizarContadorCarrito();
}

function asignarEventosComprar() {
  const botones = document.querySelectorAll('.comprar-btn');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const texto = btn.textContent.trim();
      const nombreProducto = texto.replace(/^Comprar\s+/i, '').trim();

      const producto = productos.find(p => p.nombre.toLowerCase() === nombreProducto.toLowerCase());
      if (!producto) {
        alert('Producto no encontrado en la lista.');
        return;
      }

      agregarAlCarrito(producto.nombre, producto.valor);
    });
  });
}

// Inicialización al cargar página
document.addEventListener('DOMContentLoaded', () => {
  crearElementosCarritoYBoton();
  cargarCarrito();
  actualizarCarrito();
  asignarEventosComprar();
});
