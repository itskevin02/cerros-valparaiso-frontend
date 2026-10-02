const API_URL =
    "http://localhost:3000/api";


async function obtenerDatos(ruta) {

    const respuesta =
        await fetch(
            `${API_URL}${ruta}`
        );


    if (!respuesta.ok) {

        const datosError =
            await respuesta.json();


        throw new Error(
            datosError.error ||
            "Error al consultar la API"
        );

    }


    return await respuesta.json();
}


/* =========================================
   GET
========================================= */

async function obtenerOperadores() {

    return await obtenerDatos(
        "/operadores"
    );
}


async function obtenerServicios() {

    return await obtenerDatos(
        "/servicios"
    );
}


async function obtenerReservas() {

    return await obtenerDatos(
        "/reservas"
    );
}


async function obtenerDetalles() {

    return await obtenerDatos(
        "/detalles"
    );
}


async function obtenerResumenOperadores() {

    return await obtenerDatos(
        "/resumen-operadores"
    );
}


async function obtenerTotalVentas() {

    return await obtenerDatos(
        "/total-ventas"
    );
}


async function obtenerLiquidaciones() {

    return await obtenerDatos(
        "/liquidaciones"
    );
}


async function obtenerAuditoria() {

    return await obtenerDatos(
        "/auditoria"
    );
}


/* =========================================
   POST DETALLE
========================================= */

async function crearDetalleReserva(
    detalle
) {

    const respuesta =
        await fetch(
            `${API_URL}/detalles`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        detalle
                    )
            }
        );


    const datos =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            datos.error ||
            "Error al guardar el detalle"
        );

    }


    return datos;
}


/* =========================================
   PUT DETALLE
========================================= */

async function actualizarDetalleReserva(
    idDetalle,
    detalle
) {

    const respuesta =
        await fetch(
            `${API_URL}/detalles/${idDetalle}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        detalle
                    )
            }
        );


    const datos =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            datos.error ||
            "Error al actualizar el detalle"
        );

    }


    return datos;
}


/* =========================================
   DELETE DETALLE
========================================= */

async function eliminarDetalleReserva(
    idDetalle
) {

    const respuesta =
        await fetch(
            `${API_URL}/detalles/${idDetalle}`,
            {
                method: "DELETE"
            }
        );


    const datos =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            datos.error ||
            "Error al eliminar el detalle"
        );

    }


    return datos;
}


/* =========================================
   LIQUIDACIONES
========================================= */

async function generarLiquidacion(
    idOperador
) {

    const respuesta =
        await fetch(
            `${API_URL}/liquidaciones/${idOperador}`,
            {
                method: "POST"
            }
        );


    const datos =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            datos.error ||
            "Error al generar la liquidación"
        );

    }


    return datos;
}


async function generarTodasLiquidaciones() {

    const respuesta =
        await fetch(
            `${API_URL}/liquidaciones/generar-todas`,
            {
                method: "POST"
            }
        );


    const datos =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            datos.error ||
            "Error al generar las liquidaciones"
        );

    }


    return datos;
}