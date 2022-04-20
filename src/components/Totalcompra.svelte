<script>
    import {
        addDoc,
        collection,
        getDocs,
        orderBy,
        endBefore,
        onSnapshot,
        startAt,
        query,
        where,
        doc,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import { onMount } from "svelte";
    import { Circle3 } from "svelte-loading-spinners";
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
    onMount(() => {
        loadOnza();
    });
    let datos = [];
    let carga = false;

    const loadOnza = () => {
        const q = query(collection(db, "recibo"));

        onSnapshot(q, (querySnapshot) => {
            const productos = [];
            querySnapshot.forEach((doc) => {
                productos.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            console.log("DENTRO suscribete", productos);
            datos = productos;
            carga = true;
        });
    };
    //redondear
    function myRound(num, dec) {
        var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
        return parseInt(num * exp, 10) / exp;
    }

    ///dataos que requieren de una consulta
    //COMPRAS
    const totalcerradosOnza = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == false) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalabiertosOnza = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == true && r.estadonuevo == true) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    //VENTAS
    const totalcerradosOnzaV = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == false && r.estadonuevo == false) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
    const totalabiertosOnzaV = (data) => {
        let total = 0;
        data.map((r) => {
            if (r.estado == false && r.estadonuevo == true) {
                total = total + r.totalOnza;
            }
        });
        return total;
    };
</script>

<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="card-body d-flex align-items-center justify-content-between"
        >
            {#if carga}
                <div class="card-data me-2">
                    <h5>Total de compras ONZA</h5>
                    <h2 class="fs-40 font-w600">
                        <!-- {myRound(datos.compra - datos.venta)} -->
                    </h2>

                    <div class="row  text-center" style="zoom: 50%;">
                        <div class="col-6 customer">
                            <h3 class="mb-0  font-w600 text-success">
                                {totalcerradosOnza(datos)}
                                <!-- {myRound(datos.compra)} -->
                            </h3>
                            <p class="mb-0 font-w500">Cerrados</p>
                        </div>
                        <div class="col-6 customer">
                            <h3 class="mb-0 font-w600 text-danger">
                                {totalabiertosOnza(datos)}
                                <!-- {myRound(datos.venta)} -->
                            </h3>
                            <p class="mb-0  font-w500">Abiertos</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>
                        <i class="fa fa-balance-scale" aria-hidden="true" />
                    </h1>
                </div>
            {:else}
                <div class="card-data me-2">
                    <Circle3 />
                </div>
            {/if}
        </div>
    </div>
</div>

<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="card-body d-flex align-items-center justify-content-between"
        >
            {#if carga}
                <div class="card-data me-2">
                    <h5>Total de ventas ONZA</h5>
                    <h2 class="fs-40 font-w600">
                        <!-- {myRound(datos.compra - datos.venta)} -->
                    </h2>

                    <div class="row  text-center" style="zoom: 50%;">
                        <div class="col-6 customer">
                            <h3 class="mb-0  font-w600 text-success">
                                {totalcerradosOnzaV(datos)}
                                <!-- {myRound(datos.compra)} -->
                            </h3>
                            <p class="mb-0 font-w500">Cerrados</p>
                        </div>
                        <div class="col-6 customer">
                            <h3 class="mb-0 font-w600 text-danger">
                                {totalabiertosOnzaV(datos)}
                                <!-- {myRound(datos.venta)} -->
                            </h3>
                            <p class="mb-0  font-w500">Abiertos</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>
                        <i class="fa fa-balance-scale" aria-hidden="true" />
                    </h1>
                </div>
            {:else}
                <div class="card-data me-2">
                    <Circle3 />
                </div>
            {/if}
        </div>
    </div>
</div>
