<script>
    import { Link } from "svelte-routing";
    import { navigate } from "svelte-routing";
    import moment from "moment";
    import Swal from "sweetalert2";
    import {
        addDoc,
        collection,
        getDocs,
        query,
        where,
        orderBy,
        onSnapshot,
        doc,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import { onMount } from "svelte";
    import {
        buscarMonto,
        buscarporfechaCajaChica,
    } from "../helper/helperBuscar";

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
        if (userdoss.rol == "Invitado") {
            navigate("/", { replace: true });
        }
    });
    /******acceso******/
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
    let caja = {
        fecha: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        estado: false,
        descripcion: "",
        monto: "",
        //saldo: "",
    };
    let movimientos = [];
    let montoSaldo = 0;
    const loadMonto = async () => {
        const q = query(collection(db, "monto"));

        onSnapshot(q, (querySnapshot) => {
            const productos = [];
            querySnapshot.forEach((doc) => {
                productos.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            console.log("DENTRO suscribete", productos);
            montoSaldo = productos[0].monto;
        });
    };

    const addcaja = async () => {
        // let data = await buscarMonto();
        if (caja.estado == false) {
            if (caja.monto > montoSaldo) {
                Toast.fire({
                    icon: "error",
                    title: "No puede ingresar un monto mayor al saldo actual",
                });

                return;
            }
        }

        //validar monto no pude ser negativo
        if (caja.monto < 0) {
            Toast.fire({
                icon: "error",
                title: "No puede ingresar un monto negativo",
            });
            alert("No puede ingresar un monto negativo");
            return;
        }

        console.log(montoSaldo);
        let idmonto = "wvarTMIDysZ5FgUikL3u";

        if (caja.estado == true) {
            caja.saldo = montoSaldo + caja.monto;

            try {
                const docRef = await addDoc(collection(db, "caja"), caja);
                caja.id = docRef.id;
                movimientos = [...movimientos, caja];
                console.log("Document written with ID: ", docRef.id);
                //mensaje de registro de cliente
                //*end mensaje de registro*//
                //modificar monto
                const washingtonRef = doc(db, "monto", idmonto);
                await updateDoc(washingtonRef, {
                    monto: montoSaldo + caja.monto,
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            caja.saldo = montoSaldo - caja.monto;

            try {
                const docRef = await addDoc(collection(db, "caja"), caja);
                caja.id = docRef.id;
                movimientos = [...movimientos, caja];
                console.log("Document written with ID: ", docRef.id);
                //mensaje de registro de cliente
                //*end mensaje de registro*//

                //modificar monto
                const washingtonRef = doc(db, "monto", idmonto);
                await updateDoc(washingtonRef, {
                    monto: montoSaldo - caja.monto,
                });

                Toast.fire({
                    icon: "success",
                    title: "Agregado con exito",
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }

        //limpiar campos
        caja = {
            fecha: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            estado: false,
            descripcion: "",
            monto: "",
            saldo: "",
        };
    };

    let fechadesde = moment(new Date()).format("YYYY-MM-DDTHH:mm");
    let fechaasta = moment(new Date()).format("YYYY-MM-DDTHH:mm");
    const buscarporfechadatos = async () => {
        let data = await buscarporfechaCajaChica(fechadesde, fechaasta);
        movimientos = data;
    };
    onMount(async () => {
        await buscarporfechadatos();
        await loadMonto();
    });

    const totalIngreso = (data) => {
        let total = 0;
        data.map((item) => {
            if (item.estado == true) {
                total = total + item.monto;
            }
        });
        return total;
    };
    const totalEgreso = (data) => {
        let total = 0;
        data.map((item) => {
            if (item.estado == false) {
                total = total + item.monto;
            }
        });
        return total;
    };
    const totalSaldo = (data) => {
        let total = 0;
        data.map((item) => {
            total = total + item.saldo;
        });
        return total;
    };
</script>

<div class="row page-titles">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active">
            <Link to="/caja-chica">Caja Chica</Link>
        </li>
        <li class="breadcrumb-item"><Link to="/reporte">Reporte</Link></li>
    </ol>
</div>
<div class="row">
    <div class="col-xl-3 col-md-6">
        <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="order-user">
                        <i
                            class="far fa-building bg-warning text-white"
                            aria-hidden="true"
                        />
                    </div>
                    <div class="ms-4 customer">
                        <h2 class="mb-0  font-w600">{montoSaldo}</h2>
                        <p class="mb-0  font-w500">Saldo Total</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-xl-12 col-lg-12">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Datos</h4>
            </div>
            <div class="card-body">
                <div class="basic-form">
                    <div class="row">
                        <div class="mb-3 col-md-3">
                            <label class="form-label"><b>Estado</b> </label>
                            <div class="mb-3 mb-0">
                                <label class="radio-inline me-3"
                                    ><input
                                        type="radio"
                                        name="optradio"
                                        value={true}
                                        bind:group={caja.estado}
                                    /> Ingreso</label
                                >
                                <label class="radio-inline me-3"
                                    ><input
                                        type="radio"
                                        name="optradio"
                                        value={false}
                                        bind:group={caja.estado}
                                    /> Gasto</label
                                >
                            </div>
                        </div>
                        <div class="mb-3 col-md-3">
                            <label class="form-label">Fecha</label>
                            <input
                                type="datetime-local"
                                class="form-control"
                                placeholder="1234 Main St"
                                bind:value={caja.fecha}
                            />
                        </div>
                        <div class="mb-3 col-md-3">
                            <label class="form-label">Monto</label>
                            <input
                                type="number"
                                step="any"
                                class="form-control"
                                placeholder="0.00"
                                bind:value={caja.monto}
                            />
                        </div>
                        <div class="mb-3 col-md-3">
                            <label class="form-label">Descripcion</label>
                            <textarea
                                class="form-control"
                                rows="4"
                                id="comment"
                                bind:value={caja.descripcion}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        on:click={addcaja}
                    >
                        Registrar</button
                    >
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header">
                <div class="mb-3 col-4">
                    <label class="form-label"><b>Fecha desde</b></label>
                    <input
                        type="datetime-local"
                        class="form-control"
                        placeholder="Fecha"
                        bind:value={fechadesde}
                        on:change={() => buscarporfechadatos()}
                    />
                </div>
                <div class="mb-3 col-4">
                    <label class="form-label"><b>Fecha hasta</b></label>
                    <input
                        type="datetime-local"
                        class="form-control"
                        placeholder="Fecha"
                        bind:value={fechaasta}
                        on:change={() => buscarporfechadatos()}
                    />
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-responsive-sm">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripcion</th>
                                <th>Ingreso</th>
                                <th>Gastos</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each movimientos as r}
                                <tr>
                                    <th>{r.fecha}</th>
                                    <td>{r.descripcion}</td>
                                    {#if r.estado}
                                        <td>{r.monto}</td>
                                        <td>-</td>
                                    {:else}
                                        <td>-</td>
                                        <td>{r.monto}</td>
                                    {/if}

                                    <td class="color-primary">{r.saldo}</td>
                                </tr>
                            {:else}
                                <tr>
                                    <td colspan="5"
                                        ><center>Sin datos</center></td
                                    >
                                </tr>
                            {/each}
                            <tr>
                                <td colspan="2">TOTAL</td>
                                <td>{totalIngreso(movimientos)}</td>
                                <td>{totalEgreso(movimientos)}</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
