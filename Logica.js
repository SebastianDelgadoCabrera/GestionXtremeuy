document.addEventListener('DOMContentLoaded', function() {
    const pedidoForm = document.getElementById('pedidoForm');
    const compraForm = document.getElementById('compraForm');

    document.getElementById('pedidoID').addEventListener('blur', function() {
        const id = this.value;
        fetch(`https://sheetdb.io/api/v1/YOUR_SHEET_ID/search?ID=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    document.getElementById('articulo').value = data[0].articulo;
                    document.getElementById('descripcion').value = data[0].descripcion;
                }
            });
    });

    document.getElementById('compraID').addEventListener('blur', function() {
        const id = this.value;
        fetch(`https://sheetdb.io/api/v1/YOUR_SHEET_ID/search?ID=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    document.getElementById('compraArticulo').value = data[0].articulo;
                    document.getElementById('compraDescripcion').value = data[0].descripcion;
                }
            });
    });

    pedidoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const pedidoData = {
            id: document.getElementById('pedidoID').value,
            fechaSolicitud: new Date().toISOString().split('T')[0],
            articulo: document.getElementById('articulo').value,
            descripcion: document.getElementById('descripcion').value,
            personalizacion: document.getElementById('personalizacion').value,
            precio: document.getElementById('precio').value,
            cantidad: document.getElementById('cantidad').value,
            cliente: document.getElementById('cliente').value,
            numeroContacto: document.getElementById('numeroContacto').value,
            fechaEntrega: document.getElementById('fechaEntrega').value,
            estadoPedido: 'Pendiente'
        };

        fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        }).then(response => response.json())
          .then(data => {
              updateStock(pedidoData.articulo, pedidoData.cantidad, 'subtract');
              location.reload();
          });
    });

    compraForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const compraData = {
            id: document.getElementById('compraID').value,
            fechaCompra: new Date().toISOString().split('T')[0],
            articulo: document.getElementById('compraArticulo').value,
            descripcion: document.getElementById('compraDescripcion').value,
            precio: document.getElementById('compraPrecio').value,
            cantidad: document.getElementById('compraCantidad').value,
            proveedor: document.getElementById('proveedor').value
        };

        fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        }).then(response => response.json())
          .then(data => {
              updateStock(compraData.articulo, compraData.cantidad, 'add');
              location.reload();
          });
    });

    function updateStock(articulo, cantidad, operation) {
        fetch('https://sheetdb.io/api/v1/YOUR_STOCK_SHEET_ID')
            .then(response => response.json())
            .then(stockData => {
                const item = stockData.find(row => row.articulo === articulo);
                if (item) {
                    const newCantidad = operation === 'add' ? parseInt(item.cantidad) + parseInt(cantidad) : parseInt(item.cantidad) - parseInt(cantidad);
                    fetch(`https://sheetdb.io/api/v1/YOUR_STOCK_SHEET_ID/${item.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cantidad: newCantidad })
                    });
                }
            });
    }
});
