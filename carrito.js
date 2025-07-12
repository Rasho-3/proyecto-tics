// carrito.js

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'stensaCarrito';

  const botonCarrito = document.getElementById('boton-carrito');
  const carritoFlotante = document.getElementById('carrito-flotante');

  let carrito = [];

  function cargarCarrito() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        carrito = JSON.parse(data);
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

    let html = '<h3>Carrito de Compras</h3><ul style="list-style:none; padding:0;">';

    carrito.forEach((item, i) => {
      html += `
        <li style="margin-bottom:12px; border-bottom:1px solid #ccc; padding-bottom:8px;">
          <strong>${item.nombre}</strong><br>
          Precio: Q${item.precio.toFixed(2)} GTQ<br>
          Cantidad: ${item.cantidad}
          <button data-index="${i}" class="btn-eliminar" style="
            margin-left:10px;
            background:#dc3545;
            border:none;
            color:#fff;
            border-radius:4px;
            padding:2px 6px;
            cursor:pointer;
            font-size:12px;
          ">Eliminar</button>
        </li>`;
    });

    html += '</ul>';

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    html += `<p style="font-weight:bold; margin-top:10px;">Total: Q${total.toFixed(2)} GTQ</p>`;

    carritoFlotante.innerHTML = html;

    // Añadir evento para eliminar productos
    carritoFlotante.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.index, 10);
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
    carritoFlotante.style.display = carritoFlotante.style.display === 'block' ? 'none' : 'block';
  }

  function agregarAlCarrito(nombre, precio) {
    const producto = carrito.find(p => p.nombre === nombre);
    if (producto) {
      producto.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarritoUI();
  }

  if (botonCarrito) {
    botonCarrito.addEventListener('click', toggleCarrito);
  }

  cargarCarrito();
  actualizarCarritoUI();

  // Detectar botones "Comprar" y asignar evento
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().startsWith('comprar')) {
      btn.addEventListener('click', () => {
        let nombre = btn.textContent.trim().replace(/^comprar\s+/i, '');
        let precio = 0;

        // Buscar precio en elementos cercanos con clase .precio
        let precioElem = btn.closest('main')?.querySelector('.precio') ||
                         btn.parentElement.querySelector('.precio') ||
                         btn.parentElement.parentElement.querySelector('.precio');

        if (precioElem) {
          const match = precioElem.textContent.match(/Q\s*([\d.,]+)/);
          if (match) {
            precio = parseFloat(match[1].replace(',', '.'));
          }
        }

        agregarAlCarrito(nombre, precio);
      });
    }
  });
});
