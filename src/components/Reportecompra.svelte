<script>
    import {
        addDoc,
        collection,
        getDocs,
        onSnapshot,
        query,
        where,
        orderBy,
        doc,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import { onMount } from "svelte";
    import moment from "moment";
    import {
        buscarNombre,
        buscarCi,
        buscarClienteFirebase,
    } from "../helper/helperBuscar";
    import { buscarComprasFirebase } from "../helper/helperrecibo";
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
        if (userdoss.rol != "Administrador") {
            navigate("/", { replace: true });
        }
    });
    /******acceso******/
    let buscarnombre = "";
    let datos = [];

    $: buscarnombre;
    const buscarpornombre = async () => {
        let data = await buscarNombre(buscarnombre);
        datos = data;
    };
    let buscarci = "";
    const buscarporci = async () => {
        let data = await buscarCi(buscarci);
        datos = data;
    };

    let datosnew = [];
    const comprasData = async (id) => {
        let datacom = await buscarComprasFirebase(id);
        datosnew = datacom;
        // datosnew = datacom;
    };
    const direccionRecibo = (id) => {
        navigate(`/recibo?q=${id}`, { replace: true });
    };
    ////////totales compras
    const totalPB = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.totalpesoBruto;
            }
        });
        return total;
    };
    const totalPF = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.totalPesofino;
            }
        });
        return total;
    };
    const totalONZA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalSaldo = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalSaldoBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipo = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalAnticipoBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });

        return total;
    };
    const totalTotal = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };
    const totalTotalBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estadonuevo) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    ///ventas
    const totalPBdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.totalpesoBruto;
            }
        });
        return total;
    };
    const totalPFdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.totalPesofino;
            }
        });
        return total;
    };
    const totalONZAdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalSaldodos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalSaldodosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipodos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalAnticipodosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotaldos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };
    const totalTotaldosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estadonuevo) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };

    //total totalAB
    const totalPBdosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.totalpesoBruto;
        });
        return total;
    };
    const totalPFdosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.totalPesofino;
        });
        return total;
    };
    const totalONZAdosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.totalOnza;
        });
        return total;
    };
    const totalSaldodosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.saldo;
        });
        return total;
    };
    const totalSaldodosBSTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.saldo * r.tipoCambio;
        });
        return total;
    };
    const totalAnticipodosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.anticipo;
        });
        return total;
    };
    const totalAnticipodosBSTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.anticipo * r.tipoCambio;
        });
        return total;
    };
    const totalTotaldosTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.montoTotal;
        });
        return total;
    };
    const totalTotaldosBSTT = (data) => {
        let total = 0;
        data.map((r) => {
            total = total + r.montoTotal * r.tipoCambio;
        });
        return total;
    };
    //mayusculas
    function uppercase(node) {
        const transform = () => (node.value = node.value.toUpperCase());

        node.addEventListener("input", transform, { capture: true });

        transform();
    }
    //redondear
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
            filename: `reporte.pdf`,
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
    //generar exel
    function descargarExcel() {
        var uri = "data:application/vnd.ms-excel;base64,",
            template =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)));
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };

        var table = "tblReporte";
        var name = "Canaan";

        if (!table.nodeType) table = document.getElementById(table);
        var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
        window.location.href = uri + base64(format(template, ctx));
    }

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
    const seleccionarCliente = async () => {
        console.log(id_cliente);
        datos = await buscarClienteFirebase(id_cliente, fechadesde, fechaasta);
        console.log(datos);
    };
</script>

<div class="row">
    <div class="col-4">
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
    <div class="mb-3 col-4">
        <label class="form-label"><b>Fecha desde</b></label>
        <input
            type="date"
            class="form-control"
            placeholder="Fecha"
            bind:value={fechadesde}
            on:change={() => seleccionarCliente()}
        />
    </div>
    <div class="mb-3 col-4">
        <label class="form-label"><b>Fecha hasta</b></label>
        <input
            type="date"
            class="form-control"
            placeholder="Fecha"
            bind:value={fechaasta}
            on:change={() => seleccionarCliente()}
        />
    </div>
    <!-- <div class="col-4">
        <input
            type="text"
            class="form-control"
            placeholder="Buscar por Nombre"
            bind:value={buscarnombre}
            use:uppercase
            on:change={() => buscarpornombre()}
        />
    </div>
    <div class="col-4">
        <input
            type="text"
            class="form-control"
            placeholder="Buscar por C.I."
            bind:value={buscarci}
            use:uppercase
            on:change={() => {
                buscarporci();
            }}
        />
    </div>

    <div class="col-4">-</div> -->

    <div class="col-lg-12">
        <div class="card">
            <div class="card-header">
                <div>
                    <button
                        class="btn btn-success btn-sm"
                        on:click={descargarExcel}
                        >EXEL <i
                            class="fa fa-file-excel-o"
                            aria-hidden="true"
                        /></button
                    >
                    <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        on:click={() => pdfprin()}
                        >PDF <i
                            class="fa fa-file-pdf-o"
                            aria-hidden="true"
                        /></button
                    >
                </div>
                <h4 class="card-title">REPORTE DE COMPRAS</h4>
                <h4>activo</h4>
            </div>
            <div class="card-body" id="areaImprimir">
                <div class="table-responsive">
                    <table
                        class="table table-bordered table-responsive-sm"
                        id="tblReporte"
                    >
                        <thead class="thead-info">
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre </th>

                                <!-- <th>Op.</th> -->
                                <th>Recibo</th>

                                <th>T.P.B</th>
                                <th>T.P.F</th>
                                <th> ONZA</th>
                                <th>Saldo($)</th>
                                <th>Saldo(Bs.)</th>
                                <th>Anticipo ($)</th>
                                <th>Anticipo (Bs.)</th>
                                <th>TOTAL ($)</th>
                                <th>TOTAL (Bs.)</th>

                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {#each datos as r}
                                <tr>
                                    <th>{r.fecha}</th>
                                    <td>{r.nombre_cli}</td>

                                    <!-- <td>
                                        {#if r.estadonuevo}
                                            <span class="badge badge-danger"
                                                >abierto</span
                                            >
                                        {:else}
                                            <span class="badge badge-success"
                                                >cerrado</span
                                            >
                                        {/if}
                                    </td> -->
                                    <td class="color-primary"
                                        >{String(r.numerorecibo).padStart(
                                            6,
                                            0
                                        )}</td
                                    >

                                    <td>{r.totalpesoBruto}</td>
                                    <td>{r.totalPesofino}</td>
                                    <td>{r.totalOnza.toFixed(2)}</td>
                                    <td>{r.saldo}</td>
                                    <td
                                        >{(r.saldo * r.tipoCambio).toFixed(
                                            2
                                        )}</td
                                    >
                                    <td>{r.anticipo}</td>
                                    <td
                                        >{(r.anticipo * r.tipoCambio).toFixed(
                                            2
                                        )}</td
                                    >
                                    <td class="table-info">{r.montoTotal}</td>
                                    <td class="table-info"
                                        >{(r.montoTotal * r.tipoCambio).toFixed(
                                            2
                                        )}</td
                                    >

                                    <td class="color-primary">
                                        <button
                                            class="btn btn-sm btn-dark"
                                            on:click={direccionRecibo(r.id)}
                                        >
                                            ver
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                            <!-- <tr>
                                <td>TOTAL Abierta</td>
                                <td />

                                <td />
                                <td />
                                <td />
                                <td class="table-danger"
                                    >{myRound(totalONZA(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalSaldo(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalSaldoBS(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalAnticipo(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalAnticipoBS(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalTotal(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalTotalBS(datos))}</td
                                >
                                <td />
                            </tr>
                            <tr>
                                <td>TOTAL Cerrada</td>
                                <td />
                                <td />

                                <td />
                                <td />
                                <td class="table-success"
                                    >{myRound(totalONZAdos(datos))}</td
                                >
                                <td class="table-success"
                                    >{myRound(totalSaldodos(datos))}</td
                                >
                                <td class="table-success"
                                    >{myRound(totalSaldodosBS(datos))}</td
                                >
                                <td class="table-success"
                                    >{totalAnticipodos(datos)}</td
                                >
                                <td class="table-success"
                                    >{myRound(totalAnticipodosBS(datos))}</td
                                >
                                <td class="table-success"
                                    >{myRound(totalTotaldos(datos))}</td
                                ><td class="table-success"
                                    >{myRound(totalTotaldosBS(datos))}</td
                                >
                                <td />
                            </tr> -->
                            <!-- total -->
                            <tr>
                                <td>TOTAL </td>
                                <td />
                                <td />

                                <td />
                                <td />
                                <td class="table-dark"
                                    >{myRound(totalONZAdosTT(datos))}</td
                                >
                                <td class="table-dark"
                                    >{myRound(totalSaldodosTT(datos))}</td
                                >
                                <td class="table-dark"
                                    >{myRound(totalSaldodosBSTT(datos))}</td
                                >
                                <td class="table-dark"
                                    >{totalAnticipodosTT(datos)}</td
                                >
                                <td class="table-dark"
                                    >{myRound(totalAnticipodosBSTT(datos))}</td
                                >
                                <td class="table-dark"
                                    >{myRound(totalTotaldosTT(datos))}</td
                                ><td class="table-dark"
                                    >{myRound(totalTotaldosBSTT(datos))}</td
                                >
                                <td />
                            </tr>
                            <!-- <tr>
                            <th>12/04/2022</th>
                            <td>Kolor Tea Shirt For Man</td>
                            <td
                                ><span class="badge badge-danger">venta</span>
                            </td>
                            <td class="color-primary">1</td>
                            <td
                                ><div class="d-flex align-items-center">
                                    <i
                                        class="fa fa-circle text-success me-1"
                                        aria-hidden="true"
                                    /> terminado
                                </div></td
                            >
                            <td class="color-primary">Ver</td>
                        </tr> -->
                        </tbody>
                    </table>
                </div>
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
</style>
