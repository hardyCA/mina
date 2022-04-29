<script>
    import { buscarporfecha } from "../helper/helperBuscar";
    import { buscarComprasFirebase } from "../helper/helperrecibo";
    import { navigate } from "svelte-routing";
    import moment from "moment";
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

    let fechadesde = moment(new Date()).format("yyyy-MM-DD");
    let fechaasta = moment(new Date()).format("yyyy-MM-DD");
    let datos = [];
    let estado = 1;

    onMount(async () => {
        await buscarporfechadatos();
    });
    const buscarporfechadatos = async () => {
        let data = await buscarporfecha(estado, fechadesde, fechaasta);
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
                total = total + r.montoTotal;
            }
        });
        return total;
    };

    const totalSaldoBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipoBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotalBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                total = total + r.montoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    ////////totales compras cerradas
    const totalPBCC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalpesoBruto;
                }
            }
        });
        return total;
    };
    const totalPFCC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalPesofino;
                }
            }
        });
        return total;
    };
    const totalONZACC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };

    const totalSaldoCC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipoCC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotalCC = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };

    const totalSaldoCCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipoCCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotalCCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    ////////totales compras abiertas
    const totalPBCA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalpesoBruto;
                }
            }
        });
        return total;
    };
    const totalPFCA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalPesofino;
                }
            }
        });
        return total;
    };
    const totalONZACA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };

    const totalSaldoCA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipoCA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotalCA = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };

    const totalSaldoCABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipoCABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotalCABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    /***********/
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

    const totalSaldodosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipodosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotaldosBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                total = total + r.montoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    //**********************/
    //Totales VENTAS CERRADAS
    const totalPBdosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalpesoBruto;
                }
            }
        });
        return total;
    };
    const totalPFdosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalPesofino;
                }
            }
        });
        return total;
    };
    const totalONZAdosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };

    const totalSaldodosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipodosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotaldosVC = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };

    const totalSaldodosVCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipodosVCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotaldosVCBS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == true) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };
    //TOTALES DE VENTAS ABIERTAS
    const totalPBdosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalpesoBruto;
                }
            }
        });
        return total;
    };
    const totalPFdosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado) {
                if (r.estadonuevo) {
                    total = total + r.totalPesofino;
                }
            }
        });
        return total;
    };
    const totalONZAdosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };

    const totalSaldodosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.saldo;
            }
        });
        return total;
    };
    const totalAnticipodosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.anticipo;
            }
        });
        return total;
    };
    const totalTotaldosVA = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.motoTotal;
            }
        });
        return total;
    };

    const totalSaldodosVABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.saldo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalAnticipodosVABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.anticipo * r.tipoCambio;
            }
        });
        return total;
    };
    const totalTotaldosVABS = (data) => {
        let total = 0;
        data.map((r) => {
            if (!r.estado && r.estadonuevo == false) {
                total = total + r.motoTotal * r.tipoCambio;
            }
        });
        return total;
    };
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

<div class=" mt-3 mb-3">
    <div class="row">
        <div class="mb-3 col-4">
            <label class="form-label"><b>Fecha desde</b></label>
            <input
                type="date"
                class="form-control"
                placeholder="Fecha"
                bind:value={fechadesde}
                on:change={() => buscarporfechadatos()}
            />
        </div>
        <div class="mb-3 col-4">
            <label class="form-label"><b>Fecha hasta</b></label>
            <input
                type="date"
                class="form-control"
                placeholder="Fecha"
                bind:value={fechaasta}
                on:change={() => buscarporfechadatos()}
            />
        </div>
        <div class="mb-3 col-4">
            <label class="form-label"><b>Estado</b></label>
            <select
                class="  form-control input-rounded mb-3"
                bind:value={estado}
                on:change={() => buscarporfechadatos()}
            >
                <option value={1}>Todos</option>
                <option value={true}>Compra</option>
                <option value={false}>Ventas</option>
            </select>
        </div>
    </div>
</div>

<div class="col-lg-12">
    <div class="card">
        <div class="card-header">
            <div>
                <button class="btn btn-success btn-sm" on:click={descargarExcel}
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
            <h4 class="card-title">REPORTE</h4>
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
                            <!-- <th>Operacion</th> -->
                            <th>Tipo</th>
                            <th>Recibo</th>

                            <th> ONZA</th>
                            <th>Saldo($)</th>
                            <th>Saldo(Bs.)</th>
                            <th>Anticipo($)</th>
                            <th>Anticipo(Bs.)</th>
                            <th>TOTAL($)</th>
                            <th>TOTAL(Bs.)</th>

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
                                            >Abierta</span
                                        >
                                    {:else}
                                        <span class="badge badge-success"
                                            >Cerrada</span
                                        >
                                    {/if}
                                </td> -->
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
                                    >{String(r.numerorecibo).padStart(6, 0)}</td
                                >

                                <td class="table-warning"
                                    >{r.totalOnza.toFixed(2)}</td
                                >
                                <td>{r.saldo}</td>
                                <td>{(r.saldo * r.tipoCambio).toFixed(2)}</td>
                                <td>{r.anticipo}</td>
                                <td>{(r.anticipo * r.tipoCambio).toFixed(2)}</td
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
                        <tr class="table-primary">
                            <td>TOTAL COMPRAS</td>
                            <td />

                            <td />
                            <td />
                            <td class="">
                                <!-- <span>A: {myRound(totalONZACC(datos))}</span><br
                                />
                                <span>C: {myRound(totalONZACA(datos))}</span>
                                <br /> -->
                                {myRound(totalONZA(datos))}
                            </td>
                            <!-- saldo -->
                            <td class="">
                                <!-- <span>A: {myRound(totalSaldoCC(datos))}</span
                                ><br />
                                <span>C: {myRound(totalSaldoCA(datos))}</span>
                                <br /> -->
                                {myRound(totalSaldo(datos))}
                            </td>
                            <!-- bs -->
                            <td class="">
                                <!-- <span>A: {myRound(totalSaldoCCBS(datos))}</span
                                ><br />
                                <span>C: {myRound(totalSaldoCABS(datos))}</span>
                                <br /> -->
                                {myRound(totalSaldoBS(datos))}
                            </td>
                            <!-- anticipo -->
                            <td class="">
                                <!-- <span>A: {myRound(totalAnticipoCC(datos))}</span
                                ><br />
                                <span>C: {myRound(totalAnticipoCA(datos))}</span
                                > <br /> -->
                                {myRound(totalAnticipo(datos))}
                            </td>
                            <!-- bs -->
                            <td class="">
                                <!-- <span
                                    >A: {myRound(
                                        totalAnticipoCCBS(datos)
                                    )}</span
                                ><br />
                                <span
                                    >C: {myRound(
                                        totalAnticipoCABS(datos)
                                    )}</span
                                > <br /> -->
                                {myRound(totalAnticipoBS(datos))}
                            </td>
                            <!-- total -->
                            <td class="">
                                <!-- <span>A: {myRound(totalTotalCC(datos))}</span
                                ><br />
                                <span>C: {myRound(totalTotalCA(datos))}</span>
                                <br /> -->
                                {myRound(totalTotal(datos))}
                            </td>
                            <!-- bs -->
                            <td class="">
                                <!-- <span>A: {myRound(totalTotalCCBS(datos))}</span
                                ><br />
                                <span>C: {myRound(totalTotalCABS(datos))}</span>
                                <br /> -->
                                {myRound(totalTotalBS(datos))}
                            </td>
                            <td />
                        </tr>
                        <tr class="table-danger">
                            <td>TOTAL VENTAS</td>
                            <td />

                            <td />
                            <td />
                            <td class="">
                                <!-- <span>A:{myRound(totalONZAdosVC(datos))}</span
                                ><br />
                                <span>C:{myRound(totalONZAdosVA(datos))}</span
                                ><br /> -->
                                {myRound(totalONZAdos(datos))}</td
                            >
                            <td class="">
                                <!-- <span>A:{myRound(totalSaldodosVC(datos))}</span
                                ><br />
                                <span>C:{myRound(totalSaldodosVA(datos))}</span
                                ><br /> -->
                                {myRound(totalSaldodos(datos))}</td
                            >
                            <!-- bs -->
                            <td class="">
                                <!-- <span
                                    >A:{myRound(totalSaldodosVCBS(datos))}</span
                                ><br />
                                <span
                                    >C:{myRound(totalSaldodosVABS(datos))}</span
                                ><br /> -->
                                {myRound(totalSaldodosBS(datos))}</td
                            >
                            <!-- anticipo -->
                            <td class="">
                                <!-- <span>A:{totalAnticipodosVC(datos)}</span><br />
                                <span>C:{totalAnticipodosVA(datos)}</span><br /> -->
                                {totalAnticipodos(datos)}</td
                            >
                            <!-- bs -->
                            <td class="">
                                <!-- <span>A:{totalAnticipodosVCBS(datos)}</span><br
                                />
                                <span>C:{totalAnticipodosVABS(datos)}</span><br
                                /> -->
                                {totalAnticipodosBS(datos)}</td
                            >
                            <!-- total -->
                            <td class="">
                                <!-- <span>A:{myRound(totalTotaldosVC(datos))}</span
                                ><br />
                                <span>C:{myRound(totalTotaldosVA(datos))}</span
                                ><br /> -->
                                {myRound(totalTotaldos(datos))}</td
                            >
                            <!-- bs -->
                            <td class="">
                                <!-- <span
                                    >A:{myRound(totalTotaldosVCBS(datos))}</span
                                ><br />
                                <span
                                    >C:{myRound(totalTotaldosVABS(datos))}</span
                                ><br /> -->
                                {myRound(totalTotaldosBS(datos))}</td
                            >
                            <td />
                        </tr>

                        <tr class="table-dark">
                            <td colspan="4">TOTAL</td>
                            <td
                                >{(
                                    myRound(totalONZA(datos)) -
                                    myRound(totalONZAdos(datos))
                                ).toFixed(2)}</td
                            >
                            <td
                                >{(
                                    myRound(totalSaldo(datos)) -
                                    myRound(totalSaldodos(datos))
                                ).toFixed(2)}</td
                            >
                            <td
                                >{(
                                    myRound(totalSaldoBS(datos)) -
                                    myRound(totalSaldodosBS(datos))
                                ).toFixed(2)}</td
                            >
                            <td
                                >{(
                                    myRound(totalAnticipo(datos)) -
                                    totalAnticipodos(datos)
                                ).toFixed(2)}</td
                            >
                            <td
                                >{myRound(totalAnticipoBS(datos)) -
                                    totalAnticipodosBS(datos).toFixed(2)}</td
                            >
                            <td
                                >{(
                                    myRound(totalTotal(datos)) -
                                    myRound(totalTotaldos(datos))
                                ).toFixed(2)}</td
                            >
                            <td
                                >{(
                                    myRound(totalTotalBS(datos)) -
                                    myRound(totalTotaldosBS(datos))
                                ).toFixed(2)}</td
                            >
                        </tr>
                    </tbody>
                </table>
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
