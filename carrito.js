// carrito.js

document.addEventListener('DOMContentLoaded', () => {
  // Carrito almacenado en localStorage bajo esta clave
  const STORAGE_KEY = 'stensaCarrito';

  // Obtener referencias a elementos importantes
  const botonCarrito = document.getElementById('boton-carrito');
  const carritoFlotante = document.getElementById('carrito-flotante');

  // Estado del carrito: array de objetos { nombre, precio, cantidad }
  let carrito = [];

  // Cargar carrito desde localStorage
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

  // Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }

  // Actualizar la visualización del carrito flotante
  function actualizarCarritoUI() {
    if (!carritoFlotante) return;

    if (carrito.length === 0) {
      carritoFlotante.innerHTML = '<p>El carrito está vacío.</p>';
      return;
    }

    let html = '<h3>Carrito de Compras</h3><ul style="list-style:none; padding:0;">';

    carrito.forEach((item, index) => {
      html += `
        <li style="margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">
          <strong>${item.nombre}</strong><br />
          Precio: Q${item.precio.toFixed(2)} GTQ<br />
          Cantidad: ${item.cantidad}
          <button data-index="${index}" class="btn-eliminar" style="margin-left:10px; cursor:pointer;">Eliminar</button>
        </li>
      `;
    });

    html += '</ul>';

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    html += `<p><strong>Total: Q${total.toFixed(2)} GTQ</strong></p>`;

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

  // Mostrar u ocultar carrito flotante
  function toggleCarrito() {
    if (!carritoFlotante) return;
    if (carritoFlotante.style.display === 'block') {
      carritoFlotante.style.display = 'none';
    } else {
      carritoFlotante.style.display = 'block';
    }
  }

  // Función para agregar producto al carrito
  // Recibe nombre y precio (número)
  function agregarAlCarrito(nombre, precio) {
    // Buscar si ya existe el producto
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCarritoUI();
    alert(`Se agregó "${nombre}" al carrito.`);
  }

  // Asignar evento al botón flotante del carrito
  if (botonCarrito) {
    botonCarrito.addEventListener('click', toggleCarrito);
  }

  // Inicializar carrito
  cargarCarrito();
  actualizarCarritoUI();

  // Detectar botones de compra en la página y asignar eventos
  // Consideramos botones con texto que contenga "Comprar"
  const botonesCompra = Array.from(document.querySelectorAll('button'))
    .filter(btn => btn.textContent.trim().toLowerCase().startsWith('comprar'));

  botonesCompra.forEach(boton => {
    boton.addEventListener('click', () => {
      // Intentamos obtener el nombre y precio del producto relacionado

      // Estrategia:
      // - Buscar el texto del botón para extraer nombre (ej. "Comprar Arduino UNO" -> "Arduino UNO")
      // - Buscar en el DOM cercano el precio (elemento con clase .precio o texto que contenga "Q")

      let nombreProducto = boton.textContent.trim().replace(/^comprar\s+/i, '');
      let precioProducto = null;

      // Buscar precio en el DOM cercano (padre o hermanos)
      let precioElem = boton.closest('main')?.querySelector('.precio');
      if (!precioElem) {
        // Buscar en secciones cercanas
        precioElem = boton.parentElement.querySelector('.precio') || boton.parentElement.parentElement.querySelector('.precio');
      }

      if (precioElem) {
        // Extraer número del texto, por ejemplo "Precio: Q150 GTQ"
        const precioTexto = precioElem.textContent;
        const match = precioTexto.match(/Q\s*([\d.,]+)/);
        if (match) {
          precioProducto = parseFloat(match[1].replace(',', '.'));
        }
      }

      // Si no se encontró precio, asignar 0 y avisar
      if (precioProducto === null || isNaN(precioProducto)) {
        precioProducto = 0;
        console.warn(`No se encontró precio para el producto "${nombreProducto}". Se asignó 0.`);
      }

      agregarAlCarrito(nombreProducto, precioProducto);
    });
  });
});
