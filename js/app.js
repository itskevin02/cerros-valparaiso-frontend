console.log(
    "Frontend Cerros de Valparaíso iniciado"
);


let detallesActuales = [];

let serviciosActuales = [];

let modoEdicion = false;

let idDetalleEditando = null;


/* =========================================
   FORMATO DINERO
========================================= */

function formatoDinero(valor) {

    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }
    ).format(valor || 0);
}


/* =========================================
   FORMATO FECHA
========================================= */

function formatoFecha(fecha) {

    if (!fecha) {

        return "-";

    }


    const fechaConvertida =
        new Date(fecha);


    if (
        isNaN(
            fechaConvertida.getTime()
        )
    ) {

        return fecha;

    }


    return fechaConvertida.toLocaleString(
        "es-CL",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================================
   CALCULAR SUBTOTAL
========================================= */

function calcularSubtotal() {

    const selectServicio =
        document.getElementById(
            "idServicio"
        );

    const campoCantidad =
        document.getElementById(
            "cantidadTuristas"
        );

    const campoSubtotal =
        document.getElementById(
            "subtotal"
        );


    const idServicio =
        Number(
            selectServicio.value
        );

    const cantidad =
        Number(
            campoCantidad.value
        );


    campoCantidad.setCustomValidity("");


    if (!idServicio) {

        campoSubtotal.value = "";

        campoCantidad.removeAttribute(
            "max"
        );

        return;
    }


    const servicio =
        serviciosActuales.find(
            item =>
                Number(
                    item.id_servicio
                ) === idServicio
        );


    if (!servicio) {

        campoSubtotal.value = "";

        return;
    }


    const tarifa =
        Number(
            servicio.tarifa_base
        );

    const capacidadMaxima =
        Number(
            servicio.capacidad_max
        );


    campoCantidad.max =
        capacidadMaxima;


    if (
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {

        campoSubtotal.value = "";

        return;
    }


    if (
        cantidad >
        capacidadMaxima
    ) {

        campoSubtotal.value = "";

        campoCantidad.setCustomValidity(
            `La capacidad máxima de este servicio es de ${capacidadMaxima} turistas.`
        );

        return;
    }


    const subtotal =
        tarifa * cantidad;


    campoSubtotal.value =
        subtotal;
}


/* =========================================
   DASHBOARD
========================================= */

async function cargarDashboard() {

    try {

        const ventas =
            await obtenerTotalVentas();

        const operadores =
            await obtenerOperadores();

        const servicios =
            await obtenerServicios();

        const reservas =
            await obtenerReservas();


        document.getElementById(
            "totalVentas"
        ).textContent =
            formatoDinero(
                ventas.total_ventas
            );


        document.getElementById(
            "totalOperadores"
        ).textContent =
            operadores.length;


        document.getElementById(
            "totalServicios"
        ).textContent =
            servicios.length;


        document.getElementById(
            "totalReservas"
        ).textContent =
            reservas.length;

    }
    catch (error) {

        console.error(
            "Error cargando dashboard:",
            error.message
        );

    }

}


/* =========================================
   OPERADORES
========================================= */

async function cargarOperadores() {

    const tabla =
        document.getElementById(
            "tablaOperadores"
        );


    try {

        const operadores =
            await obtenerResumenOperadores();


        tabla.innerHTML = "";


        operadores.forEach(
            operador => {

                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${operador.id_operador}
                        </td>

                        <td>
                            ${operador.nombre_fantasia}
                        </td>

                        <td>
                            ${operador.cerro}
                        </td>

                        <td>
                            ${formatoDinero(
                                operador.total_ventas
                            )}
                        </td>

                        <td>
                            ${formatoDinero(
                                operador.monto_comision
                            )}
                        </td>

                        <td>
                            ${formatoDinero(
                                operador.monto_a_pagar
                            )}
                        </td>

                    </tr>
                `;

            }
        );

    }
    catch (error) {

        tabla.innerHTML = `
            <tr>

                <td colspan="6">
                    No se pudieron cargar
                    los operadores.
                </td>

            </tr>
        `;

    }

}


/* =========================================
   SERVICIOS
========================================= */

async function cargarServicios() {

    const tabla =
        document.getElementById(
            "tablaServicios"
        );


    try {

        const servicios =
            await obtenerServicios();


        tabla.innerHTML = "";


        servicios.forEach(
            servicio => {

                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${servicio.id_servicio}
                        </td>

                        <td>
                            ${servicio.descripcion}
                        </td>

                        <td>
                            ${formatoDinero(
                                servicio.tarifa_base
                            )}
                        </td>

                        <td>
                            ${servicio.capacidad_max}
                        </td>

                        <td>
                            ${servicio.id_operador}
                        </td>

                    </tr>
                `;

            }
        );

    }
    catch (error) {

        tabla.innerHTML = `
            <tr>

                <td colspan="5">
                    No se pudieron cargar
                    los servicios.
                </td>

            </tr>
        `;

    }

}


/* =========================================
   COMBOS
========================================= */

async function cargarCombos() {

    try {

        const reservas =
            await obtenerReservas();

        const servicios =
            await obtenerServicios();

        const operadores =
            await obtenerOperadores();


        serviciosActuales =
            servicios;


        const selectReserva =
            document.getElementById(
                "idReserva"
            );


        selectReserva.innerHTML = `
            <option value="">
                Seleccione una reserva
            </option>
        `;


        reservas.forEach(
            reserva => {

                selectReserva.innerHTML += `
                    <option
                        value="${reserva.id_reserva}"
                    >
                        Reserva ${reserva.id_reserva}
                        -
                        Cliente ${reserva.rut_cliente}
                        -
                        ${reserva.estado}
                    </option>
                `;

            }
        );


        const selectServicio =
            document.getElementById(
                "idServicio"
            );


        selectServicio.innerHTML = `
            <option value="">
                Seleccione un servicio
            </option>
        `;


        servicios.forEach(
            servicio => {

                selectServicio.innerHTML += `
                    <option
                        value="${servicio.id_servicio}"
                    >
                        ${servicio.id_servicio}
                        -
                        ${servicio.descripcion}
                        -
                        ${formatoDinero(
                            servicio.tarifa_base
                        )}
                        -
                        Máx. ${servicio.capacidad_max}
                    </option>
                `;

            }
        );


        const selectOperador =
            document.getElementById(
                "operadorLiquidacion"
            );


        selectOperador.innerHTML = `
            <option value="">
                Seleccione un operador
            </option>
        `;


        operadores.forEach(
            operador => {

                selectOperador.innerHTML += `
                    <option
                        value="${operador.id_operador}"
                    >
                        ${operador.id_operador}
                        -
                        ${operador.nombre_fantasia}
                    </option>
                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Error cargando listas:",
            error.message
        );

    }

}


/* =========================================
   DETALLES
========================================= */

async function cargarDetalles() {

    const tabla =
        document.getElementById(
            "tablaDetalles"
        );


    try {

        detallesActuales =
            await obtenerDetalles();


        tabla.innerHTML = "";


        if (
            detallesActuales.length === 0
        ) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="7">
                        No hay detalles registrados.
                    </td>

                </tr>
            `;

            return;

        }


        detallesActuales.forEach(
            detalle => {

                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${detalle.id_detalle}
                        </td>

                        <td>
                            ${detalle.id_reserva}
                        </td>

                        <td>
                            ${detalle.id_servicio}
                            -
                            ${detalle.descripcion_servicio}
                        </td>

                        <td>
                            ${detalle.cant_turistas}
                        </td>

                        <td>
                            ${formatoDinero(
                                detalle.subtotal
                            )}
                        </td>

                        <td>
                            ${formatoFecha(
                                detalle.fecha_servicio
                            )}
                        </td>

                        <td>

                            <div class="acciones-detalle">

                                <button
                                    type="button"
                                    class="boton-editar"
                                    onclick="editarDetalle(
                                        ${detalle.id_detalle}
                                    )"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="boton-eliminar"
                                    onclick="eliminarDetalle(
                                        ${detalle.id_detalle}
                                    )"
                                >
                                    Eliminar
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }
        );

    }
    catch (error) {

        tabla.innerHTML = `
            <tr>

                <td colspan="7">
                    No se pudieron cargar
                    los detalles.
                </td>

            </tr>
        `;

    }

}


/* =========================================
   EDITAR DETALLE
========================================= */

function editarDetalle(idDetalle) {

    const detalle =
        detallesActuales.find(
            item =>
                Number(
                    item.id_detalle
                ) === Number(
                    idDetalle
                )
        );


    if (!detalle) {

        return;

    }


    modoEdicion = true;

    idDetalleEditando =
        detalle.id_detalle;


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Editar Detalle de Reserva";


    const campoId =
        document.getElementById(
            "idDetalle"
        );


    campoId.value =
        detalle.id_detalle;

    campoId.disabled = true;


    document.getElementById(
        "idReserva"
    ).value =
        detalle.id_reserva;


    document.getElementById(
        "idServicio"
    ).value =
        detalle.id_servicio;


    document.getElementById(
        "cantidadTuristas"
    ).value =
        detalle.cant_turistas;


    calcularSubtotal();


    document.getElementById(
        "fecha"
    ).value =
        String(
            detalle.fecha_servicio
        ).substring(0, 10);


    document.getElementById(
        "btnGuardarDetalle"
    ).textContent =
        "Actualizar Detalle";


    document.getElementById(
        "btnCancelarEdicion"
    ).style.display =
        "block";


    document.getElementById(
        "reservas"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   CANCELAR EDICIÓN
========================================= */

function cancelarEdicion() {

    modoEdicion = false;

    idDetalleEditando = null;


    formularioReserva.reset();


    const campoCantidad =
        document.getElementById(
            "cantidadTuristas"
        );


    campoCantidad.removeAttribute(
        "max"
    );

    campoCantidad.setCustomValidity(
        ""
    );


    document.getElementById(
        "subtotal"
    ).value = "";


    document.getElementById(
        "idDetalle"
    ).disabled = false;


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Registrar Detalle de Reserva";


    document.getElementById(
        "btnGuardarDetalle"
    ).textContent =
        "Guardar Detalle";


    document.getElementById(
        "btnCancelarEdicion"
    ).style.display =
        "none";

}


/* =========================================
   ELIMINAR DETALLE
========================================= */

async function eliminarDetalle(idDetalle) {

    const confirmar =
        confirm(
            `¿Está seguro de eliminar el detalle ${idDetalle}?`
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await eliminarDetalleReserva(
                idDetalle
            );


        alert(
            respuesta.mensaje
        );


        if (
            Number(
                idDetalleEditando
            ) === Number(
                idDetalle
            )
        ) {

            cancelarEdicion();

        }


        await cargarDashboard();

        await cargarOperadores();

        await cargarDetalles();

        await cargarAuditoria();

    }
    catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================
   LIQUIDACIONES
========================================= */

async function cargarLiquidaciones() {

    const tabla =
        document.getElementById(
            "tablaLiquidaciones"
        );


    try {

        const liquidaciones =
            await obtenerLiquidaciones();


        tabla.innerHTML = "";


        if (
            liquidaciones.length === 0
        ) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="6">
                        No hay liquidaciones
                        registradas.
                    </td>

                </tr>
            `;

            return;

        }


        liquidaciones.forEach(
            liquidacion => {

                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${liquidacion.id_liquidacion}
                        </td>

                        <td>
                            ${liquidacion.id_operador}
                        </td>

                        <td>
                            ${formatoDinero(
                                liquidacion.monto_bruto
                            )}
                        </td>

                        <td>
                            ${formatoDinero(
                                liquidacion.monto_comision
                            )}
                        </td>

                        <td>
                            ${formatoDinero(
                                liquidacion.monto_a_pagar
                            )}
                        </td>

                        <td>
                            ${formatoFecha(
                                liquidacion.fecha_calculo
                            )}
                        </td>

                    </tr>
                `;

            }
        );

    }
    catch (error) {

        tabla.innerHTML = `
            <tr>

                <td colspan="6">
                    No se pudieron cargar
                    las liquidaciones.
                </td>

            </tr>
        `;

    }

}


/* =========================================
   AUDITORÍA
========================================= */

async function cargarAuditoria() {

    const tabla =
        document.getElementById(
            "tablaAuditoria"
        );


    try {

        const auditoria =
            await obtenerAuditoria();


        tabla.innerHTML = "";


        if (
            auditoria.length === 0
        ) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="4">
                        Aún no hay registros
                        de auditoría.
                    </td>

                </tr>
            `;

            return;

        }


        auditoria.forEach(
            registro => {

                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${registro.id_auditoria}
                        </td>

                        <td>
                            ${formatoFecha(
                                registro.fecha_evento
                            )}
                        </td>

                        <td>
                            ${registro.usuario_bd}
                        </td>

                        <td>
                            ${registro.operacion}
                        </td>

                    </tr>
                `;

            }
        );

    }
    catch (error) {

        tabla.innerHTML = `
            <tr>

                <td colspan="4">
                    No se pudo cargar
                    la auditoría.
                </td>

            </tr>
        `;

    }

}


/* =========================================
   FORMULARIO
========================================= */

const formularioReserva =
    document.getElementById(
        "form-reserva"
    );


document.getElementById(
    "idServicio"
).addEventListener(
    "change",
    calcularSubtotal
);


document.getElementById(
    "cantidadTuristas"
).addEventListener(
    "input",
    calcularSubtotal
);


formularioReserva.addEventListener(
    "submit",
    async function (evento) {

        evento.preventDefault();


        calcularSubtotal();


        const idDetalle =
            Number(
                document.getElementById(
                    "idDetalle"
                ).value
            );


        const campoCantidad =
            document.getElementById(
                "cantidadTuristas"
            );


        if (
            !Number.isInteger(
                idDetalle
            ) ||
            idDetalle <= 0
        ) {

            alert(
                "El ID Detalle debe ser un número entero mayor a 0."
            );

            return;
        }


        if (!modoEdicion) {

            const idRepetido =
                detallesActuales.some(
                    detalle =>
                        Number(
                            detalle.id_detalle
                        ) === idDetalle
                );


            if (idRepetido) {

                alert(
                    `El ID Detalle ${idDetalle} ya está registrado. Debe utilizar un ID diferente.`
                );

                return;
            }

        }


        if (
            !campoCantidad.checkValidity()
        ) {

            campoCantidad.reportValidity();

            return;
        }


        const cantidadTuristas =
            Number(
                campoCantidad.value
            );


        const subtotalCalculado =
            Number(
                document.getElementById(
                    "subtotal"
                ).value
            );


        if (
            !Number.isInteger(
                cantidadTuristas
            ) ||
            cantidadTuristas <= 0
        ) {

            alert(
                "La cantidad de turistas debe ser un número entero mayor a 0."
            );

            return;
        }


        if (
            !subtotalCalculado ||
            subtotalCalculado <= 0
        ) {

            alert(
                "No se pudo calcular el subtotal. Revise el servicio y la cantidad de turistas."
            );

            return;
        }


        const detalle = {

            id_detalle:
                idDetalle,

            id_reserva:
                document.getElementById(
                    "idReserva"
                ).value,

            id_servicio:
                document.getElementById(
                    "idServicio"
                ).value,

            cant_turistas:
                cantidadTuristas,

            subtotal:
                subtotalCalculado,

            fecha_servicio:
                document.getElementById(
                    "fecha"
                ).value

        };


        try {

            let respuesta;


            if (modoEdicion) {

                respuesta =
                    await actualizarDetalleReserva(
                        idDetalleEditando,
                        detalle
                    );

            }
            else {

                respuesta =
                    await crearDetalleReserva(
                        detalle
                    );

            }


            alert(
                respuesta.mensaje
            );


            cancelarEdicion();


            await cargarDashboard();

            await cargarOperadores();

            await cargarDetalles();

            await cargarAuditoria();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


/* =========================================
   CANCELAR
========================================= */

document.getElementById(
    "btnCancelarEdicion"
).addEventListener(
    "click",
    cancelarEdicion
);


/* =========================================
   GENERAR LIQUIDACIÓN
========================================= */

document.getElementById(
    "btnGenerarLiquidacion"
).addEventListener(
    "click",
    async function () {

        const operador =
            document.getElementById(
                "operadorLiquidacion"
            ).value;


        if (!operador) {

            alert(
                "Seleccione un operador."
            );

            return;

        }


        try {

            const respuesta =
                await generarLiquidacion(
                    operador
                );


            alert(
                respuesta.mensaje
            );


            await cargarLiquidaciones();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


/* =========================================
   GENERAR TODAS
========================================= */

document.getElementById(
    "btnGenerarTodas"
).addEventListener(
    "click",
    async function () {

        const confirmar =
            confirm(
                "¿Desea generar las liquidaciones de todos los operadores?"
            );


        if (!confirmar) {

            return;

        }


        try {

            const respuesta =
                await generarTodasLiquidaciones();


            alert(
                respuesta.mensaje
            );


            await cargarLiquidaciones();

        }
        catch (error) {

            alert(
                error.message
            );

        }

    }
);


/* =========================================
   INICIO
========================================= */

async function iniciarAplicacion() {

    await Promise.all([

        cargarDashboard(),

        cargarOperadores(),

        cargarServicios(),

        cargarCombos(),

        cargarDetalles(),

        cargarLiquidaciones(),

        cargarAuditoria()

    ]);

}


iniciarAplicacion();