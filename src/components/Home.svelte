<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Oro from "./Oro.svelte";
    import Onza from "./Onza.svelte";
    import { links } from "svelte-routing";
    import Totalcompra from "./Totalcompra.svelte";

    //*******permisos*******/
    let userdos = {};
    function ver() {
        if (localStorage.getItem("usuario")) {
            let data = JSON.parse(localStorage.getItem("usuario"));
            userdos = data;
        } else {
            // console.log("No autenticado");
        }
    }
    $: ver();

    onMount(() => {
        if (localStorage.getItem("io")) {
            console.log("entro Home");
        } else {
            // console.log("no entro Home");
            navigate("/login", { replace: true });
        }
    });
    /*******end permisos*/
    //https://fontawesome.com/v4/icons/
    //     celular: 77777777
    // estado: true
    // fecha: "2022-03-26"
    // id: "4eMZ2SxxdpSLsJiUBxyh"
    // nombre: "admin"
    // password: "admin"
    // rol: "Administrador"
    // usuario: "admin"
</script>

<div class="row" use:links>
    {#if userdos.rol == "Administrador"}
        <Oro />
        <Onza />
        <Totalcompra />

        <div class="col-xl-3 col-sm-6">
            <a href="/venta" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Vender material</h5>
                            <h2 class="fs-40 font-w600">VENTA</h2>
                        </div>
                        <div>
                            <h1 class="text-danger">
                                <i
                                    class="fa fa-caret-square-o-down"
                                    aria-hidden="true"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-xl-3 col-sm-6">
            <a href="/buscar" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Buscar Cliente</h5>
                            <h2 class="fs-40 font-w600">BUSCAR</h2>
                        </div>
                        <div><h1><i class="flaticon-381-search-2" /></h1></div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-xl-3 col-sm-6">
            <a href="/reporte" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Reporte de venta y compra</h5>
                            <h2 class="fs-40 font-w600">REPORTES</h2>
                        </div>
                        <div>
                            <h1 class="text-warning">
                                <i class="fa fa-pie-chart" aria-hidden="true" />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-xl-3 col-sm-6">
            <a href="/reporte-compra" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Reporte de compra</h5>
                            <h2 class="fs-40 font-w600">REPORTE COMPRA</h2>
                        </div>
                        <div>
                            <h1 class="text-warning">
                                <i class="fa fa-bar-chart" aria-hidden="true" />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-xl-3 col-sm-6">
            <a href="/reporte-venta" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Reporte de venta</h5>
                            <h2 class="fs-40 font-w600">REPORTE VENTA</h2>
                        </div>
                        <div>
                            <h1 class="text-warning">
                                <i
                                    class="fa fa-area-chart"
                                    aria-hidden="true"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-xl-3 col-sm-6">
            <a href="/usuario" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Usuarios del Sistema</h5>
                            <h2 class="fs-40 font-w600">USUARIO</h2>
                        </div>
                        <div>
                            <h1 class="text-warning">
                                <i
                                    class="fa fa-user-circle"
                                    aria-hidden="true"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-xl-3 col-sm-6">
            <a href="/cliente" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Registro de cliente</h5>
                            <h2 class="fs-40 font-w600">CLIENTES</h2>
                        </div>
                        <div>
                            <h1 class="text-success">
                                <i class="fa fa-users" aria-hidden="true" />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    {/if}
    {#if userdos.rol == "Administrador" || userdos.rol == "Invitado"}
        <div class="col-xl-3 col-sm-6">
            <a href="/compra" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Comprar material</h5>
                            <h2 class="fs-40 font-w600">COMPRA</h2>
                        </div>
                        <div>
                            <h1 class="text-primary">
                                <i
                                    class="fa fa-caret-square-o-up"
                                    aria-hidden="true"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    {/if}
    {#if userdos.rol == "Administrador" || userdos.rol == "Asistente"}
        <div class="col-xl-3 col-sm-6">
            <a href="/caja-chica" style="text-decoration:none">
                <div class="card">
                    <div
                        class="card-body d-flex align-items-center justify-content-between"
                    >
                        <div class="card-data me-2">
                            <h5>Caja Chica</h5>
                            <h2 class="fs-40 font-w600">CAJA</h2>
                        </div>
                        <div>
                            <h1 class="text-dark">
                                <i
                                    class="fa fa-shopping-bag"
                                    aria-hidden="true"
                                />
                            </h1>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    {/if}
</div>
