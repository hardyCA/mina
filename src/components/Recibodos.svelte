<script>
    //http://localhost:8080/recibo?q=eRuqYOV9ppQpVhstXYEK
    import {
        addDoc,
        collection,
        getDocs,
        query,
        where,
        orderBy,
        doc,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import {
        buscarReciboFirebase,
        buscarComprasFirebase,
        buscarComprasFirebaseCliente,
    } from "../helper/helperrecibo";
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import Oro from "./Oro.svelte";
    import Onza from "./Onza.svelte";
    import { navigate } from "svelte-routing";
    import moment from "moment";
    import Swal from "sweetalert2";
    //alertas
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    ///****acceso***/
    let userdoss = {};
    function vers() {
        if (localStorage.getItem("usuario")) {
            let data = JSON.parse(localStorage.getItem("usuario"));
            userdoss = data;
        } else {
            console.log("No autenticado");
        }
    }
    $: vers();

    onMount(() => {
        if (localStorage.getItem("io")) {
            console.log("entro Home");
        } else {
            console.log("no entro Home");
            navigate("/login", { replace: true });
        }
        if (userdoss.rol == "Asistente") {
            navigate("/", { replace: true });
        }
    });
    /******acceso******/

    // const url = new URL(window.location);
    // url.searchParams.get("bob");

    // console.log(url.searchParams.get("q"));
    let compra = {};
    let compras = [];
    let recibos = {};

    // const ver = async () => {
    //     console.log(url.searchParams.get("q"));
    //     compras = await buscarComprasFirebase(url.searchParams.get("q"));
    //     recibos = await buscarReciboFirebase(url.searchParams.get("q"));

    //     console.log(compras);
    //     console.log(recibos);
    // };

    // $: onMount(() => {
    //     ver();
    // });

    //modificar
    const total = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.costo);
        });
        return total;
    };
    const totalBS = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.costo) * r.tipoCambio;
        });
        return total;
    };
    const totalpesobruto = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.pesobruto);
        });
        return total;
    };
    const totalonza = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.onza);
        });
        return total;
    };
    const totalpesofino = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.pesofino);
        });
        return total;
    };

    // total abiertos
    const totalAB = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (r.estado) {
                total = total + Number(r.costo);
            }
        });
        return total;
    };
    const totalABBS = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (r.estado) {
                total = total + Number(r.costo) * r.tipoCambio;
            }
        });
        return total;
    };
    const totalpesobrutoAB = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (r.estado) {
                total = total + Number(r.pesobruto);
            }
        });
        return total;
    };
    const totalonzaAB = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (r.estado) {
                total = total + Number(r.onza);
            }
        });
        return total;
    };
    const totalpesofinoAB = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (r.estado) {
                total = total + Number(r.pesofino);
            }
        });
        return total;
    };
    //total cerrados
    const totalCE = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (!r.estado) {
                total = total + Number(r.costo);
            }
        });
        return total;
    };
    const totalCEBS = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (!r.estado) {
                total = total + Number(r.costo) * r.tipoCambio;
            }
        });
        return total;
    };
    const totalpesobrutoCE = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (!r.estado) {
                total = total + Number(r.pesobruto);
            }
        });
        return total;
    };
    const totalonzaCE = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (!r.estado) {
                total = total + Number(r.onza);
            }
        });
        return total;
    };
    const totalpesofinoCE = (data) => {
        let total = 0;
        data.map((r, i) => {
            if (!r.estado) {
                total = total + Number(r.pesofino);
            }
        });
        return total;
    };
    //////////////////////////////////////
    let anticipar = "";
    let cotizacion = "";
    let estadodos = false;
    let iddos = "";
    let dataAnticipo = "";
    $: dataAnticipo = recibos.anticipo;
    let mostrarTipocambio = false;

    let nuevoIdRecibo = "";
    const modificarcompra = async () => {
        console.log(iddos);
        console.log(cotizacion);

        console.log(compra);

        // recibos.estadonuevo = false;

        let anticipomod = 100;

        let onzadosmod = (
            (cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (anticipomod / 100)) /
            compra.variable
        ).toFixed(3);

        let preciounitariomod = myRound(
            (cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (anticipomod / 100)) /
                compra.variable
        );

        let costomod = Math.trunc(compra.pesobruto * preciounitariomod);
        //mificar firebase
        //**compra*/
        const washingtonRefdos = doc(db, "compras", compra.id);
        await updateDoc(washingtonRefdos, {
            anticipo: anticipomod,
            estado: estadodos,
            cotizacion: cotizacion,
            onzados: onzadosmod,
            preciounitario: preciounitariomod,
            costo: costomod,
        });
        //compras de factura

        let montoNuevocompras = await buscarComprasFirebase(compra.idrecibo);

        //**recibo  */
        const washingtonRef = doc(db, "recibo", compra.idrecibo);
        await updateDoc(washingtonRef, {
            montoTotal: total(montoNuevocompras),
            saldo: total(montoNuevocompras),
            estadonuevo: false,
        });

        //midificar compra js
        compras = compras.map((p) => {
            if (p.iddos == iddos) {
                return {
                    ...p,
                    anticipo: anticipomod,
                    estado: estadodos,
                    cotizacion: cotizacion,
                    onzados: onzadosmod,
                    preciounitario: preciounitariomod,
                    costo: costomod,
                };
            } else {
                return p;
            }
        });
        console.log(compras);
    };

    ///
    const modanticipar = async () => {
        dataAnticipo = dataAnticipo + anticipar;
        const washingtonRef = doc(db, "recibo", url.searchParams.get("q"));
        await updateDoc(washingtonRef, {
            anticipo: dataAnticipo,
            saldo: total(compras) - dataAnticipo,
        });
    };

    function myRound(num, dec) {
        var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
        return parseInt(num * exp, 10) / exp;
    }

    /////PDF PD PDF
    //pdf
    const pdfprin = () => {
        console.log("entro");
        var element = document.getElementById("areaImprimir");
        var opt = {
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            margin: 0.5,
            filename: `Comprobante-${String(recibos.numerorecibo).padStart(
                6,
                0
            )}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 5,
                logging: true,
                dpi: 192,
                letterRendering: true,
            },
            jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
        };
        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();

        // Old monolithic-style usage:
        //  html2pdf(element, opt);
        // window.open("data:application/pdf," + encodeURI(pdfString));
    };

    ///buscar clientes por select
    let clientes = [];
    const loadClientes = async () => {
        let data = [];
        const querySnapshot = await getDocs(collection(db, "cliente"));
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        clientes = data;

        console.log(clientes);
    };
    onMount(async () => {
        await loadClientes();
    });
    let id_cliente = "";
    let fechadesde = moment(new Date()).format("yyyy-MM-DD");
    let fechaasta = moment(new Date()).format("yyyy-MM-DD");
    let estadonuevo = 1;
    let estadoVentaCompra = true;
    const seleccionarCliente = async () => {
        console.log(estadonuevo);
        compras = await buscarComprasFirebaseCliente(
            id_cliente,
            fechadesde,
            fechaasta,
            estadonuevo
        );
        //datos = await buscarClienteFirebase(id_cliente, fechadesde, fechaasta);
        //console.log(datos);
    };

    //chechbox
    let selection = [];
    let nuevaCotizacion = "";
    const cerrarPocicionGrupo = async () => {
        console.log(selection);

        console.log(iddos);
        console.log(cotizacion);
        console.log(compra);

        if (nuevaCotizacion == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar Cotizacion",
            });
            return;
        }

        // recibos.estadonuevo = false;

        selection.map(async (r) => {
            // inicio

            let anticipomod = 100;

            let onzadosmod = (
                (nuevaCotizacion *
                    (r.ley / 100) *
                    (1 - r.descuento / 100) *
                    (anticipomod / 100)) /
                r.variable
            ).toFixed(3);

            let preciounitariomod = myRound(
                (nuevaCotizacion *
                    (r.ley / 100) *
                    (1 - r.descuento / 100) *
                    (anticipomod / 100)) /
                    r.variable
            );

            let costomod = Math.trunc(r.pesobruto * preciounitariomod);
            //mificar firebase
            //**r*/
            const washingtonRefdos = doc(db, "compras", r.id);
            await updateDoc(washingtonRefdos, {
                anticipo: anticipomod,
                estado: estadodos,
                cotizacion: nuevaCotizacion,
                onzados: onzadosmod,
                preciounitario: preciounitariomod,
                costo: costomod,
            });
            //compras de factura

            let montoNuevocompras = await buscarComprasFirebase(r.idrecibo);

            //**recibo  */
            const washingtonRef = doc(db, "recibo", r.idrecibo);
            await updateDoc(washingtonRef, {
                montoTotal: total(montoNuevocompras),
                saldo: total(montoNuevocompras),
                estadonuevo: false,
            });

            //midificar r js
            //compras = compras.filter((row) => row.id !== r.id);

            compras = compras.map((p) => {
                if (p.id == r.id) {
                    return {
                        ...p,
                        anticipo: anticipomod,
                        estado: estadodos,
                        cotizacion: nuevaCotizacion,
                        onzados: onzadosmod,
                        preciounitario: preciounitariomod,
                        costo: costomod,
                    };
                } else {
                    return p;
                }
            });
            console.log(compras);
            //final
            Toast.fire({
                icon: "success",
                title: "Cerrar Posicion",
            });
        });
    };
</script>

<!-- <div class="row page-titles">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active">
            <Link to="/compra">Compra</Link>
        </li>
        <li class="breadcrumb-item">
            <Link to="/venta">Venta</Link>
        </li>
    </ol>
</div> -->
<!-- <div class="row">
    <Oro />
    <Onza />
</div> -->

<div class="row">
    <div class="mb-3 col-12">
        <label class="form-label"><b>Estado ventas</b></label>
        <select
            class="  form-control input-rounded mb-3"
            bind:value={estadoVentaCompra}
        >
            <option value={true}>Compras</option>
            <option value={false}>Ventas</option>
        </select>
    </div>
    <div class="mb-3 col-3">
        <div class="mb-3">
            <label class="form-label">Seleccionar cliente</label>
            <select
                id="clientenew"
                class="  form-control input-rounded mb-3"
                bind:value={id_cliente}
                on:change={() => seleccionarCliente()}
            >
                {#each clientes as r}
                    <option value={r.id}>{r.nombre}</option>
                {:else}
                    <option value="0">Seleccionar Usuario</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="mb-3 col-3">
        <label class="form-label"><b>Fecha desde</b></label>
        <input
            type="date"
            class="form-control"
            placeholder="Fecha"
            bind:value={fechadesde}
            on:change={() => seleccionarCliente()}
        />
    </div>
    <div class="mb-3 col-3">
        <label class="form-label"><b>Fecha hasta</b></label>
        <input
            type="date"
            class="form-control"
            placeholder="Fecha"
            bind:value={fechaasta}
            on:change={() => seleccionarCliente()}
        />
    </div>
    <div class="mb-3 col-3">
        <label class="form-label"><b>Estado</b></label>
        <select
            class="  form-control input-rounded mb-3"
            bind:value={estadonuevo}
            on:change={() => seleccionarCliente()}
        >
            <option value={1}>Todos</option>
            <option value={true}>Abiertas</option>
            <option value={false}>Cerradas</option>
        </select>
    </div>

    <div class="col-xl-12 col-lg-12">
        <div class="row">
            <div class="col-lg-12">
                <div class="card mt-3">
                    <div class="card-header">
                        <div>
                            <!-- <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                on:click={guardar}>Guardar</button
                            > -->

                            <button
                                type="button"
                                class="btn btn-danger btn-sm"
                                on:click={() => pdfprin()}>PDF</button
                            >
                            <!-- <Link to="/compra">
                                <button class="btn btn-dark btn-sm"
                                    >Nuevo</button
                                >
                            </Link> -->

                            <!-- Button trigger modal -->
                            <!-- <button
                                type="button"
                                class="btn btn-success mb-2 btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                >Anticipo</button
                            > -->
                            <button
                                class="btn btn-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target=".bd-example-modal-lg"
                                >Cerrar Pociciones</button
                            >
                        </div>

                        <div class="col-xl-4 col-xxl-6 col-6">
                            <div
                                class="form-check custom-checkbox mb-3 checkbox-info"
                            >
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    bind:checked={mostrarTipocambio}
                                />
                                <label
                                    class="form-check-label"
                                    for="customCheckBox2"
                                    >Mostrar en Bolivianos</label
                                >
                            </div>
                        </div>

                        <span class="float-end">
                            {#if recibos.estadonuevo}
                                <div class="d-flex align-items-center">
                                    <i
                                        class="fa fa-circle text-danger me-1"
                                        aria-hidden="true"
                                    /> Abierto
                                </div>
                            {:else}
                                <div class="d-flex align-items-center">
                                    <i
                                        class="fa fa-circle text-success me-1"
                                        aria-hidden="true"
                                    /> Cerrado
                                </div>
                            {/if}
                        </span>
                    </div>
                    <div id="areaImprimir" class="myDivToPrint">
                        <div class="card-body">
                            <div class="table-responsive tabla-xxzoom">
                                <table class="table  table-bordered ">
                                    <!-- <thead>
                                        <tr>
                                            {#each compras as r}
                                                <td class="table-dark"
                                                    >Anticipo: <br />
                                                    {r.anticipo}
                                                    %</td
                                                >
                                                <td class="table-warning"
                                                    >descuento: <br />
                                                    {r.descuento}
                                                    %</td
                                                >
                                            {/each}
                                        </tr>
                                    </thead>. -->
                                    <thead class="thead-info  ">
                                        <tr>
                                            <th scope="col"
                                                ><small> Fecha </small></th
                                            >
                                            <!-- <th scope="col"  id>---------</th> -->
                                            {#if mostrarTipocambio}
                                                <th scope="col"
                                                    ><small>
                                                        Peso <br /> Bruto
                                                    </small></th
                                                >
                                            {/if}
                                            <th scope="col" id>
                                                {#if mostrarTipocambio}
                                                    <small>
                                                        Peso <br /> Fundido
                                                    </small>
                                                {:else}
                                                    <small>
                                                        Peso <br /> Bruto
                                                    </small>
                                                {/if}
                                            </th>
                                            <th scope="col"
                                                ><small> Ley </small></th
                                            >
                                            <th scope="col"
                                                ><small>
                                                    Peso <br /> fino
                                                </small></th
                                            >
                                            <th scope="col"
                                                ><small> ONZA </small></th
                                            >
                                            <th scope="col"
                                                ><small> Cotizacion </small></th
                                            >
                                            <th scope="col"
                                                ><small> ONZA </small></th
                                            >
                                            <th scope="col"
                                                ><small> P. UNIT($) </small></th
                                            >
                                            {#if mostrarTipocambio}
                                                <th scope="col"
                                                    ><small>
                                                        P. UNIT(Bs.)
                                                    </small></th
                                                >
                                            {/if}
                                            <th scope="col"
                                                ><small> Costo ($) </small></th
                                            >
                                            {#if mostrarTipocambio}
                                                <th scope="col"
                                                    ><small>
                                                        Costo (Bs)
                                                    </small></th
                                                >
                                            {/if}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each compras as r}
                                            <!-- compras o ventas -->
                                            {#if estadoVentaCompra == r.estadonuevo}
                                                <tr>
                                                    <td
                                                        >{r.fecha}

                                                        {#if r.estado}
                                                            <div
                                                                class="d-flex align-items-center"
                                                            >
                                                                <i
                                                                    class="fa fa-circle text-danger me-1"
                                                                    aria-hidden="true"
                                                                /> Abierto
                                                            </div>
                                                        {:else}
                                                            <div
                                                                class="d-flex align-items-center"
                                                            >
                                                                <i
                                                                    class="fa fa-circle text-success me-1"
                                                                    aria-hidden="true"
                                                                /> Cerrado
                                                            </div>
                                                        {/if}
                                                        Anticipo:
                                                        {r.anticipo}
                                                        %<br />
                                                        descuento:
                                                        {r.descuento}
                                                        %
                                                    </td>
                                                    <!-- <td>
                                                    Anticipo: {r.anticipo}
                                                    %
                                                    <br />
                                                    descuento: {r.descuento}
                                                    %
                                                     </td> -->
                                                    {#if mostrarTipocambio}
                                                        <td>{r.ref}</td>
                                                    {/if}
                                                    <td>{r.pesobruto}</td>
                                                    <td>{r.ley} %</td>
                                                    <td>{r.pesofino}</td>
                                                    <td class="table-info">
                                                        {r.onza}</td
                                                    >
                                                    <td>{r.cotizacion}</td>
                                                    <td>{r.onzados}</td>
                                                    <td>{r.preciounitario}</td>
                                                    {#if mostrarTipocambio}
                                                        <td
                                                            >{(
                                                                r.preciounitario *
                                                                r.tipoCambio
                                                            ).toFixed(2)}</td
                                                        >
                                                    {/if}

                                                    <td class="table-info"
                                                        >{r.costo}</td
                                                    >
                                                    {#if mostrarTipocambio}
                                                        <td class="table-info"
                                                            >{(
                                                                r.costo *
                                                                r.tipoCambio
                                                            ).toFixed(2)}</td
                                                        >
                                                    {/if}

                                                    {#if r.estado}
                                                        <td>
                                                            <button
                                                                on:click={() => {
                                                                    iddos =
                                                                        r.iddos;
                                                                    compra = r;
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#cerrarpocicion"
                                                                class="btn btn-primary shadow btn-xs sharp "
                                                                ><i
                                                                    class="fa fa-pencil"
                                                                    aria-hidden="true"
                                                                /></button
                                                            >
                                                        </td>
                                                    {/if}
                                                </tr>
                                            {:else}{/if}
                                        {/each}
                                        <!-- total  -->
                                        <tr class="table-dark">
                                            <td>Total</td>
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td
                                                >{totalpesobruto(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td />

                                            <td
                                                >{totalpesofino(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td
                                                >{totalonza(compras).toFixed(
                                                    2
                                                )}</td
                                            >
                                            <td />
                                            <td />
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td />
                                            <td>{total(compras).toFixed(2)}</td>
                                            {#if mostrarTipocambio}
                                                <td
                                                    >{totalBS(compras).toFixed(
                                                        2
                                                    )}</td
                                                >
                                            {/if}
                                        </tr>

                                        <!-- total abiertas -->
                                        <tr class="table-success">
                                            <td>Total Abiertas</td>
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td
                                                >{totalpesobrutoAB(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td />

                                            <td
                                                >{totalpesofinoAB(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td
                                                >{totalonzaAB(compras).toFixed(
                                                    2
                                                )}</td
                                            >
                                            <td />
                                            <td />
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td />
                                            <td
                                                >{totalAB(compras).toFixed(
                                                    2
                                                )}</td
                                            >
                                            {#if mostrarTipocambio}
                                                <td
                                                    >{totalABBS(
                                                        compras
                                                    ).toFixed(2)}</td
                                                >
                                            {/if}
                                        </tr>
                                        <!-- total cerradas -->
                                        <tr class="table-danger">
                                            <td>Total cerradas</td>
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td
                                                >{totalpesobrutoCE(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td />

                                            <td
                                                >{totalpesofinoCE(
                                                    compras
                                                ).toFixed(2)}</td
                                            >
                                            <td
                                                >{totalonzaCE(compras).toFixed(
                                                    2
                                                )}</td
                                            >
                                            <td />
                                            <td />
                                            {#if mostrarTipocambio}
                                                <td />
                                            {/if}
                                            <td />
                                            <td
                                                >{totalCE(compras).toFixed(
                                                    2
                                                )}</td
                                            >
                                            {#if mostrarTipocambio}
                                                <td
                                                    >{totalCEBS(
                                                        compras
                                                    ).toFixed(2)}</td
                                                >
                                            {/if}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="cerrarpocicion">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cerrar pocicion</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="mb-3 col-md-6">
                        <label class="form-label"><b>Nueva Cotizacion</b></label
                        >
                        <input
                            type="number"
                            step="any"
                            class="form-control"
                            placeholder="0.00"
                            bind:value={cotizacion}
                        />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-danger light"
                    data-bs-dismiss="modal">Cerrar</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-dismiss="modal"
                    on:click={() => modificarcompra()}>Cerrar Pocicion</button
                >
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="exampleModalCenter">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Anticipar</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>
            <div class="modal-body">
                <div class="mb-3 col-md-12">
                    <label class="form-label"><b>Dar un anticipo</b></label>
                    <input
                        type="number"
                        step="any"
                        class="form-control"
                        placeholder="0.00"
                        bind:value={anticipar}
                    />
                </div>
                <div class="col-6">TOTAL: ${total(compras).toFixed(2)}</div>
                <div class="col-6">
                    SALDO: $ {total(compras).toFixed(2) -
                        dataAnticipo -
                        anticipar}
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-danger light"
                    data-bs-dismiss="modal">Cerrar</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-dismiss="modal"
                    on:click={() => modanticipar()}>Guardar</button
                >
            </div>
        </div>
    </div>
</div>
<!-- Large modal -->

<div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <Oro />
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                />
            </div>
            <div class="modal-body">
                <table class="table  table-bordered ">
                    <thead class="thead-info  ">
                        <tr>
                            <th scope="col"><small> Fecha </small></th>
                            <!-- <th scope="col"  id>---------</th> -->

                            <th scope="col"><small> Peso Bruto</small></th>

                            <th scope="col"><small> ONZA </small></th>
                            <th scope="col"><small> Cotizacion </small></th>

                            <th scope="col"><small> P. UNIT($) </small></th>

                            <th scope="col"><small> Costo ($) </small></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each compras as r}
                            <!-- compras o ventas -->
                            {#if estadoVentaCompra == r.estadonuevo}
                                <tr>
                                    <td
                                        >{r.fecha}

                                        {#if r.estado}
                                            <div
                                                class="d-flex align-items-center"
                                            >
                                                <i
                                                    class="fa fa-circle text-danger me-1"
                                                    aria-hidden="true"
                                                /> Abierto
                                            </div>
                                        {:else}
                                            <div
                                                class="d-flex align-items-center"
                                            >
                                                <i
                                                    class="fa fa-circle text-success me-1"
                                                    aria-hidden="true"
                                                /> Cerrado
                                            </div>
                                        {/if}
                                    </td>

                                    <td>{r.pesobruto}</td>

                                    <td class="table-info"> {r.onza}</td>
                                    <td>{r.cotizacion}</td>

                                    <td>{r.preciounitario}</td>

                                    <td class="table-info">{r.costo}</td>

                                    {#if r.estado}
                                        <td>
                                            <div
                                                class="form-check custom-checkbox mb-3 checkbox-info"
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    checked=""
                                                    id="customCheckBox2"
                                                    bind:group={selection}
                                                    value={r}
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="customCheckBox2"
                                                    >Cerrar</label
                                                >
                                            </div>
                                        </td>
                                    {/if}
                                </tr>
                            {:else}{/if}
                        {/each}
                        <!-- total  -->
                        <tr class="table-dark">
                            <td>Total</td>

                            <td>{totalpesobruto(compras).toFixed(2)}</td>

                            <td>{totalonza(compras).toFixed(2)}</td>
                            <td />
                            <td />

                            <td>{total(compras).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <div class="mb-3 col-md-12">
                    <label class="form-label"><b>Nueva Cotizacion</b></label>
                    <input
                        type="number"
                        step="any"
                        class="form-control"
                        placeholder="0.00"
                        bind:value={nuevaCotizacion}
                    />
                </div>

                <button
                    type="button"
                    class="btn btn-danger light"
                    data-bs-dismiss="modal">Cancelar</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-dismiss="modal"
                    on:click={() => cerrarPocicionGrupo()}
                >
                    Cerrar Pocicion</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    #areaImprimir {
        page-break-inside: avoid;
        transform: scale(0.8);
        transform-origin: 0 0;
        margin: 0 -25% 0 0;
        padding-right: 10px;
    }
    #table-zoomhead {
        zoom: 80%;
    }
</style>
