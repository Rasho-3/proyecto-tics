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
  { nombre: "Sensor de Luz", valor: 35 },
  { nombre: "Kit Básico", valor: 385 },
  { nombre: "Kit Avanzado", valor: 800 },
  { nombre: "Kit Profesional", valor: 1200 }
];

let carrito = [];
let total = 0;

function crearCarritoFlotante() {
  const carritoDiv = document.getElementById('carrito-flotante');
  carritoDiv.innerHTML = `
    <h3 style="margin: 0 0 10px 0; font-size: 1.2em;">Carrito de Compras</h3>
    <ul id="lista-carrito" style="list-style:none; padding-left:0; max-height:150px; overflow-y:auto; margin-bottom:10px;"></ul>
    <div><strong>Total: Q<span id="total-carrito">0</span></strong></div>
  `;
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

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  if (totalGuardado) {
    total = parseInt(totalGuardado, 10);
  }
  actualizarCarrito();
}

function asignarEventosComprar() {
  const botones = Array.from(document.querySelectorAll('button')).filter(btn =>
    btn.textContent.trim().toLowerCase().startsWith('comprar')
  );

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const texto = btn.textContent.trim();
      const nombreProducto = texto.replace(/^comprar\s+/i, '').trim();

      const producto = productos.find(p => p.nombre.toLowerCase() === nombreProducto.toLowerCase());
      if (!producto) {
        alert('Producto no encontrado en la lista.');
        return;
      }

      agregarAlCarrito(producto.nombre, producto.valor);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  crearCarritoFlotante();
  cargarCarrito();
  asignarEventosComprar();

  const botonCarrito = document.getElementById('boton-carrito');
  const carritoDiv = document.getElementById('carrito-flotante');

  if (botonCarrito && carritoDiv) {
    carritoDiv.style.display = 'none'; // oculto inicialmente

    botonCarrito.addEventListener('click', () => {
      if (carritoDiv.style.display === 'none') {
        carritoDiv.style.display = 'block';
      } else {
        carritoDiv.style.display = 'none';
      }
    });
  }
});
