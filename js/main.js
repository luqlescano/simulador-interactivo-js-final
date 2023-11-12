const Auto = function (marca, modelo, anio, estado) {
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.estado = estado;
}

let listaAutos = [];

if (localStorage.getItem("listaAutos")) {
    listaAutos = JSON.parse(localStorage.getItem("listaAutos"));

    mostrarAutosEnTabla();
} else {
    cargarDesdeJSON();
}

function cargarDesdeJSON() {
    fetch("./autos.json")
        .then(response => response.json())
        .then(data => {
            if (data && data.autos) {
                const nuevosAutos = data.autos.filter(jsonAuto => !listaAutos.some(localAuto => sonIguales(jsonAuto, localAuto)));
                
                listaAutos = [...listaAutos, ...nuevosAutos];

                mostrarAutosEnTabla();
            }
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
        })
}

function mostrarAutosEnTabla() {
    const tablaAutos = document.getElementById("tabla-autos");
    const fragmento = document.createDocumentFragment();

    listaAutos.forEach(function(auto) {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
        <td>${auto.marca.toUpperCase()}</td>
        <td>${auto.modelo.toUpperCase()}</td>
        <td>${auto.anio}</td>
        <td>${auto.estado.toUpperCase()}</td>
        `;
        
        fragmento.appendChild(fila);
    });

    tablaAutos.innerHTML = "";
    tablaAutos.appendChild(fragmento);
}

const filtroMarca = document.getElementById("filtro-marca");

filtroMarca.addEventListener("input", function() {
    const filtro = filtroMarca.value.toLowerCase();
    const tablaAutos = document.getElementById("tabla-autos");

    tablaAutos.innerHTML = "";

    listaAutos.forEach(function(auto) {
        if (auto.marca.toLowerCase().includes(filtro)) {
            const fila = tablaAutos.insertRow();

            fila.innerHTML = `
            <td>${auto.marca.toUpperCase()}</td>
            <td>${auto.modelo.toUpperCase()}</td>
            <td>${auto.anio}</td>
            <td>${auto.estado.toUpperCase()}</td>
            `;
        }
    });
});

const agregarAutoButton = document.getElementById("agregar-auto");

agregarAutoButton.addEventListener("click", function(event) {
    event.preventDefault();

    const marcaInput = document.getElementById("marca-input").value;
    const modeloInput = document.getElementById("modelo-input").value;
    const anioInput = parseInt(document.getElementById("anio-input").value, 10);
    const estadoInput = document.getElementById("estado-input").value;

    if (!marcaInput.match(/^[A-Za-z]+$/)) {
        Swal.fire(
            '¡Error en Marca!',
            'Recordá que el campo no puede estar vacio y solo se admiten letras...',
            'error',
          );
        return;
    }

    if (!modeloInput.match(/^[A-Za-z0-9]+$/)) {
        Swal.fire(
            '¡Error en Modelo!',
            'Recordá que el campo no puede estar vacio y solo se admiten letras / números...',
            'error',
          );
        return;
    }

    if (isNaN(anioInput) || anioInput <= 1900 || anioInput >= 2024) {
        Swal.fire(
            '¡Error en Año!',
            'Recordá que el campo no puede estar vacio y solo se admiten autos que hayan sido fabricados entre 1900 y 2024...',
            'error'
        );
        return;
    }

    if (!estadoInput.match(/^[A-Za-z]+$/)) {
        Swal.fire(
            '¡Error en Estado!',
            'Recordá que el campo no puede estar vacio y solo se admiten letras...',
            'error',
          );
        return;
    }

    const nuevoAuto = new Auto(marcaInput, modeloInput, anioInput, estadoInput);
    listaAutos.push(nuevoAuto);

    localStorage.setItem("listaAutos", JSON.stringify(listaAutos));

    document.getElementById("marca-input").value = "";
    document.getElementById("modelo-input").value = "";
    document.getElementById("anio-input").value = "";
    document.getElementById("estado-input").value = "";

    mostrarAutosEnTabla();

    notificarAgregadoCorrectamente(marcaInput, modeloInput);
});

function notificarAgregadoCorrectamente(marca, modelo) {
    Toastify({
        text: `${marca} ${modelo} fue agregad@ correctamente.`,
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: "linear-gradient(to right, #7066E0, #625ec3)",
        },
    }).showToast();
}