<script>
    import { buscarNombre, buscarCi } from "../helper/helperBuscar";
    import { buscarComprasFirebase } from "../helper/helperrecibo";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
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
            // console.log("entro Home");
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
            if (r.estado) {
                total = total + r.totalpesoBruto;
            }
        });
        return total;
    };
    const totalPF = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.totalPesofino;
            }
        });
        return total;
    };
    const totalONZA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalSaldo = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipo = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotal = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };
    ///ventas
    const totalPBdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.totalpesoBruto;
            }
        });
        return total;
    };
    const totalPFdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.totalPesofino;
            }
        });
        return total;
    };
    const totalONZAdos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalSaldodos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipodos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotaldos = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.montoTotal;
            }
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
</script>

<div class="row">
    <div class="col-4">
        <input
            type="text"
            class="form-control"
            placeholder="Buscar por Nombre"
            bind:value={buscarnombre}
            use:uppercase
            on:change={() => buscarpornombre()}
        />
    </div>
    <!-- <div class="col-4">
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
    </div> -->

    <div class="col-4">-</div>

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
                <h4 class="card-title">REPORTE POR NOMBRE</h4>
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
                                <th>Nombre completo</th>

                                <th>Tipo</th>
                                <th>Recibo</th>

                                <th>T.P.B</th>
                                <th>T.P.F</th>
                                <th> ONZA</th>
                                <th>Saldo</th>
                                <th>Anticipo</th>
                                <th>TOTAL</th>

                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {#each datos as r}
                                <tr>
                                    <th>{r.fecha}</th>
                                    <td>{r.nombre_cli}</td>

                                    <td>
                                        {#if r.estado}
                                            <span class="badge badge-primary"
                                                >compra</span
                                            >
                                        {:else}
                                            <span class="badge badge-danger"
                                                >venta</span
                                            >
                                        {/if}
                                    </td>
                                    <td class="color-primary"
                                        >{String(r.numerorecibo).padStart(
                                            6,
                                            0
                                        )}</td
                                    >

                                    <td>{r.totalpesoBruto}</td>
                                    <td>{r.totalPesofino}</td>
                                    <td>{r.totalOnza}</td>
                                    <td>{r.saldo}</td>
                                    <td>{r.anticipo}</td>
                                    <td>{r.montoTotal}</td>

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
                            <tr>
                                <td>TOTAL COMPRAS</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td class="table-primary"
                                    >{myRound(totalONZA(datos))}</td
                                >
                                <td class="table-primary"
                                    >{myRound(totalSaldo(datos))}</td
                                >
                                <td class="table-primary"
                                    >{myRound(totalAnticipo(datos))}</td
                                >
                                <td class="table-primary"
                                    >{myRound(totalTotal(datos))}</td
                                >
                                <td />
                            </tr>
                            <tr>
                                <td>TOTAL VENTAS</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td class="table-danger"
                                    >{myRound(totalONZAdos(datos))}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalSaldodos(datos))}</td
                                >
                                <td class="table-danger"
                                    >{totalAnticipodos(datos)}</td
                                >
                                <td class="table-danger"
                                    >{myRound(totalTotaldos(datos))}</td
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
        padding-right: 10px;
    }
</style>
