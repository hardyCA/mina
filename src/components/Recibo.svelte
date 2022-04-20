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
    } from "../helper/helperrecibo";
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import Oro from "./Oro.svelte";
    import Onza from "./Onza.svelte";
    import { navigate } from "svelte-routing";

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

    const url = new URL(window.location);
    url.searchParams.get("bob");

    console.log(url.searchParams.get("q"));
    let compra = {};
    let compras = [];
    let recibos = {};

    const ver = async () => {
        console.log(url.searchParams.get("q"));
        compras = await buscarComprasFirebase(url.searchParams.get("q"));
        recibos = await buscarReciboFirebase(url.searchParams.get("q"));

        console.log(compras);
        console.log(recibos);
    };

    $: onMount(() => {
        ver();
    });

    //modificar
    const total = (data) => {
        let total = 0;
        data.map((r, i) => {
            total = total + Number(r.costo);
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
    let anticipar = "";
    let cotizacion = "";
    let estadodos = false;
    let iddos = "";
    let dataAnticipo = "";
    $: dataAnticipo = recibos.anticipo;

    const modificarcompra = async () => {
        console.log(iddos);
        console.log(cotizacion);
        recibos.estadonuevo = false;
        let onzadosmod = (
            (cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (compra.anticipo / 100)) /
            compra.variable
        ).toFixed(3);

        let preciounitariomod = myRound(
            (cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (compra.anticipo / 100)) /
                compra.variable
        );

        let costomod = Math.trunc(compra.pesobruto * preciounitariomod);
        //mificar firebase
        //**recibo  */
        const washingtonRef = doc(db, "recibo", url.searchParams.get("q"));
        await updateDoc(washingtonRef, {
            montoTotal: total(compras),
            saldo: total(compras) - dataAnticipo,
            estadonuevo: false,
        });
        //**compra*/
        const washingtonRefdos = doc(db, "compras", compra.id);
        await updateDoc(washingtonRefdos, {
            estado: estadodos,
            cotizacion: cotizacion,
            onzados: onzadosmod,
            preciounitario: preciounitariomod,
            costo: costomod,
        });

        //midificar compra js
        compras = compras.map((p) => {
            if (p.iddos == iddos) {
                return {
                    ...p,
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
                scale: 2,
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
<div class="row">
    <Oro />
    <Onza />
</div>
<div class="row">
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
                            <Link to="/compra">
                                <button class="btn btn-dark btn-sm"
                                    >Nuevo</button
                                >
                            </Link>

                            <!-- Button trigger modal -->
                            <button
                                type="button"
                                class="btn btn-success mb-2 btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                >Anticipo</button
                            >
                        </div>
                        <strong>{recibos.fecha}</strong>

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
                    <div id="areaImprimir">
                        <div class="card-body">
                            <div class="row mb-2">
                                <div
                                    class="mt-1 col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex align-items-center justify-content-center"
                                >
                                    <div>
                                        <div>
                                            Señor(es): {recibos.nombre_cli}
                                        </div>

                                        <div>
                                            Fecha: {recibos.fecha}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="mt-1 col-xl-2 col-lg-2 col-md-6 col-sm-12"
                                />
                                <div
                                    class="mt-1 col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex justify-content-lg-end justify-content-md-center justify-content-xs-start"
                                >
                                    <div class="row align-items-center">
                                        <div class="col-12">
                                            <div class="brand-logo mb-3">
                                                <img
                                                    class="logo-abbr me-2"
                                                    width="100"
                                                    src="./images/logonuevo.png"
                                                    alt=""
                                                />

                                                <!-- <img
                                                class="logo-compact"
                                                width="110"
                                                src="./images/logo-text.svg"
                                                alt=""
                                            /> -->
                                            </div>
                                            <span
                                                ><strong class="d-block"
                                                    >Nro. {String(
                                                        recibos.numerorecibo
                                                    ).padStart(6, 0)}</strong
                                                >
                                            </span>
                                        </div>
                                        <div class="col-sm-3 mt-3">
                                            <!-- <img
                                            src="images/qr.png"
                                            alt=""
                                            class="img-fluid width110"
                                        /> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table  table-bordered ">
                                    <thead class="thead-info">
                                        <tr>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">---------</th>
                                            <th scope="col">Peso bruto</th>
                                            <th scope="col">Ley</th>
                                            <th scope="col">Peso fino</th>
                                            <th scope="col">ONZA</th>
                                            <th scope="col">Cotizacion</th>
                                            <th scope="col">ONZA</th>
                                            <th scope="col">P. UNIT</th>
                                            <th scope="col">Costo</th>
                                            <th scope="col" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each compras as r}
                                            <tr>
                                                <td
                                                    >{r.fecha}

                                                    {#if r.estado}
                                                        <div
                                                            class="d-flex align-items-center"
                                                        >
                                                            <i
                                                                class="fa fa-circle text-success me-1"
                                                                aria-hidden="true"
                                                            /> Abierto
                                                        </div>
                                                    {:else}
                                                        <div
                                                            class="d-flex align-items-center"
                                                        >
                                                            <i
                                                                class="fa fa-circle text-danger me-1"
                                                                aria-hidden="true"
                                                            /> Cerrado
                                                        </div>
                                                    {/if}
                                                </td>
                                                <td>
                                                    Anticipo: {r.anticipo}
                                                    %
                                                    <br />
                                                    descuento: {r.descuento}
                                                    %
                                                </td>
                                                <td>{r.pesobruto}</td>
                                                <td>{r.ley} %</td>
                                                <td>{r.pesofino}</td>
                                                <td class="table-info"
                                                    >{r.onza}</td
                                                >
                                                <td>{r.cotizacion}</td>
                                                <td>{r.onzados}</td>
                                                <td>{r.preciounitario}</td>
                                                <td class="table-info"
                                                    >{r.costo}</td
                                                >
                                                <td>
                                                    <div class="d-flex">
                                                        {#if r.estado}
                                                            <button
                                                                on:click={() => {
                                                                    iddos =
                                                                        r.iddos;
                                                                    compra = r;
                                                                }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#cerrarpocicion"
                                                                class="btn btn-primary shadow btn-xs sharp me-1"
                                                                ><i
                                                                    class="fa fa-pencil"
                                                                    aria-hidden="true"
                                                                /></button
                                                            >
                                                        {:else}{/if}

                                                        <!-- <button
                                                        on:click={() => {
                                                            eliminarcompra(
                                                                r.iddos
                                                            );
                                                        }}
                                                        class="btn btn-danger shadow btn-xs sharp"
                                                        ><i
                                                            class="fa fa-trash"
                                                            aria-hidden="true"
                                                        /></button
                                                    > -->
                                                    </div>
                                                </td>
                                            </tr>
                                        {/each}

                                        <tr class="table-dark">
                                            <td>Total</td>
                                            <td />
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
                                            <td />
                                            <td>{total(compras).toFixed(2)}</td>
                                            <td />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="row">
                                <div class="col-lg-4 col-sm-5" />
                                <div class="col-lg-4 col-sm-5 ms-auto">
                                    <table
                                        class="table table-bordered  primary-table-bg-hover"
                                    >
                                        <tbody>
                                            <tr>
                                                <td class="left"
                                                    ><strong>Monto Total</strong
                                                    ></td
                                                >
                                                <td class="right"
                                                    >$ {total(compras).toFixed(
                                                        2
                                                    )}</td
                                                >
                                            </tr>
                                            <tr>
                                                <td class="left"
                                                    ><strong>Anticipo</strong
                                                    ></td
                                                >
                                                <td class="right"
                                                    >$ {dataAnticipo}</td
                                                >
                                            </tr>

                                            <tr>
                                                <td class="left"
                                                    ><strong>Saldo</strong></td
                                                >
                                                <td class="right"
                                                    ><strong
                                                        >$ {total(
                                                            compras
                                                        ).toFixed(2) -
                                                            dataAnticipo}</strong
                                                    ><br />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                </div>
                            </div>
                        </div>
                        <br />
                        <hr />
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

<style>
    #areaImprimir {
        page-break-inside: avoid;
        padding-right: 0px;
    }
</style>
