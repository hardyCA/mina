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
    // let userdoss = {};
    // function vers() {
    //     if (localStorage.getItem("usuario")) {
    //         let data = JSON.parse(localStorage.getItem("usuario"));
    //         userdoss = data;
    //     } else {
    //         console.log("No autenticado");
    //     }
    // }
    // $: vers();

    // onMount(() => {
    //     if (localStorage.getItem("io")) {
    //         console.log("entro Home");
    //     } else {
    //         console.log("no entro Home");
    //         navigate("/login", { replace: true });
    //     }
    //     if (userdoss.rol != "Administrador") {
    //         navigate("/", { replace: true });
    //     }
    // });
    /******acceso******/
    onMount(() => {
        loadOnza();
    });
    let datos = {};
    let carga = false;
    const loadOnza = () => {
        const q = query(collection(db, "onza"));

        onSnapshot(q, (querySnapshot) => {
            const productos = [];
            querySnapshot.forEach((doc) => {
                productos.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            console.log("DENTRO suscribete", productos);
            datos = productos[0];
            carga = true;
        });
    };
    //redondear
    function myRound(num, dec) {
        var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
        return parseInt(num * exp, 10) / exp;
    }
</script>

<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="card-body d-flex align-items-center justify-content-between"
        >
            {#if carga}
                <div class="card-data me-2">
                    <h5>Total de ONZA</h5>
                    <h2 class="fs-40 font-w600">
                        {myRound(datos.compra - datos.venta)}
                    </h2>

                    <div class="row  text-center" style="zoom: 50%;">
                        <div class="col-6 customer">
                            <h3 class="mb-0  font-w600 text-primary">
                                {myRound(datos.compra)}
                            </h3>
                            <p class="mb-0 font-w500">Compras</p>
                        </div>
                        <div class="col-6 customer">
                            <h3 class="mb-0 font-w600 text-danger">
                                {myRound(datos.venta)}
                            </h3>
                            <p class="mb-0  font-w500">Ventas</p>
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
