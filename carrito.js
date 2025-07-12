// carrito.js

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'stensaCarrito';

  const botonCarrito = document.getElementById('boton-carrito');
  const carritoFlotante = document.getElementById('carrito-flotante');

  let carrito = [];

  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem(STORAGE_KEY);
    if (carritoGuardado) {
      try {
        carrito = JSON.parse(carritoGuardado);
      } catch {
        carrito = [];
      }
    }
  }

  function guardarCarrito() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }

  function actualizarCarritoUI() {
    if (!carritoFlotante) return;

    if (carrito.length === 0) {
      carritoFlotante.innerHTML = '<p>El carrito está vacío.</p>';
      return;
    }

    let html = '<h3>Carrito de Compras</h3><ul style="list-style:none; padding:0; margin:0;">';

    carrito.forEach((item, index) => {
      html += `
        <li style="margin-bottom:12px; border-bottom:1px solid #ddd; padding-bottom:8px;">
          <strong>${item.nombre}</strong><br />
          Precio: Q${item.precio.toFixed(2)} GTQ<br />
          Cantidad: ${item.cantidad}
          <button data-index="${index}" class="btn-eliminar" style="
            margin-left:10px;
            cursor:pointer;
            background:#dc3545;
            border:none;
            color:#fff;
            border-radius:4px;
            padding:2px 6px;
            font-size:12px;
          ">Eliminar</button>
        </li>
      `;
    });

    html += '</ul>';

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    html += `<p style="font-weight:bold; margin-top:10px;">Total: Q${total.toFixed(2)} GTQ</p>`;

    carritoFlotante.innerHTML = html;

    // Añadir eventos para eliminar productos
    const btnsEliminar = carritoFlotante.querySelectorAll('.btn-eliminar');
    btnsEliminar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          carrito.splice(idx, 1);
          guardarCarrito();
          actualizarCarritoUI();
        }
      });
    });
  }

  function toggleCarrito() {
    if (!carritoFlotante) return;
    if (carritoFlotante.style.display === 'block') {
      carritoFlotante.style.display = 'none';
    } else {
      carritoFlotante.style.display = 'block';
    }
  }

  function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarritoUI();
    // Se elimina la alerta para no mostrar notificación emergente
  }

  if (botonCarrito) {
    botonCarrito.addEventListener('click', toggleCarrito);
  }

  cargarCarrito();
  actualizarCarritoUI();

  // Detectar botones de compra
  const botonesCompra = Array.from(document.querySelectorAll('button'))
    .filter(btn => btn.textContent.trim().toLowerCase().startsWith('comprar'));

  botonesCompra.forEach(boton => {
    boton.addEventListener('click', () => {
      let nombreProducto = boton.textContent.trim().replace(/^comprar\s+/i, '');
      let precioProducto = null;

      let precioElem = boton.closest('main')?.querySelector('.precio');
      if (!precioElem) {
        precioElem = boton.parentElement.querySelector('.precio') || boton.parentElement.parentElement.querySelector('.precio');
      }

      if (precioElem) {
        const precioTexto = precioElem.textContent;
        const match = precioTexto.match(/Q\s*([\d.,]+)/);
        if (match) {
          precioProducto = parseFloat(match[1].replace(',', '.'));
        }
      }

      if (precioProducto === null || isNaN(precioProducto)) {
        precioProducto = 0;
        console.warn(`No se encontró precio para el producto "${nombreProducto}". Se asignó 0.`);
      }

      agregarAlCarrito(nombreProducto, precioProducto);
    });
  });
});
