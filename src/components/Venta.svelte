<script>
    import { Link } from "svelte-routing";
    import { buscarClienteFirebase } from "../helper/helperCliente";
    import { firebaseNumeroFac } from "../helper/helperFactura";
    import Swal from "sweetalert2";
    import { onMount } from "svelte";
    import moment from "moment";
    import { navigate } from "svelte-routing";
    import Oro from "./Oro.svelte";
    import Onza from "./Onza.svelte";
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
    ///tiempo real onza
    onMount(() => {
        loadOnza();
    });
    let datos = {};
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
        });
    };
    //usuario
    let userdos = {};
    function ver() {
        if (localStorage.getItem("usuario")) {
            let data = JSON.parse(localStorage.getItem("usuario"));
            userdos = data;
        } else {
            console.log("No autenticado");
        }
    }
    $: ver();
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

    let busquedaCi = { nombre: "", ci: "", celular: "", id: "" };
    const buscarClienteCi = async (ci) => {
        const busqueda = await buscarClienteFirebase(busquedaCi.ci);
        if (busqueda.length == 0) {
            await console.log("sin datos");
            await Toast.fire({
                icon: "error",
                title: "Cliente no registrado",
            });
        } else {
            await console.log(busqueda[0]);
            busquedaCi = {
                nombre: busqueda[0].nombre,
                ci: busqueda[0].ci,
                celular: busqueda[0].celular,
                id: busqueda[0].id,
            };
            await Toast.fire({
                icon: "success",
                title: "Cliente encontrado",
            });
        }
    };

    //generar id unico segundario
    function uniqueId(prefix) {
        var id = +new Date() + "-" + Math.floor(Math.random() * 1000);
        return prefix ? prefix + id : id;
    }
    //end ide segundario
    let compra = {
        pesobruto: "",
        ley: "",
        // pesofino: "",
        //  onza: "",
        cotizacion: "",
        // onzados: "",
        // preciounitario: "",
        //costo: "",
        descuento: "",
        anticipo: "",
        variable: 31.104,
        fecha: moment(new Date()).format("yyyy-MM-DD"),
        estado: false,
    };
    let compras = [];

    $: compra.pesofino = ((compra.pesobruto * compra.ley) / 100).toFixed(2);
    $: compra.onza = (compra.pesofino / compra.variable).toFixed(2);

    //onza dos
    $: if (compra.estado) {
        compra.onzados = (
            (compra.cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (compra.anticipo / 100)) /
            compra.variable
        ).toFixed(3);

        //onza dos end

        compra.preciounitario = myRound(
            (compra.cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                (compra.anticipo / 100)) /
                compra.variable
        );
    } else {
        compra.onzados = (
            (compra.cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                1) /
            compra.variable
        ).toFixed(3);

        //onza dos end

        compra.preciounitario = myRound(
            (compra.cotizacion *
                (compra.ley / 100) *
                (1 - compra.descuento / 100) *
                1) /
                compra.variable
        );
    }

    $: compra.costo = Math.trunc(compra.pesobruto * compra.preciounitario);

    const addCompra = () => {
        //validar formulario
        if (compra.pesobruto == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese el peso bruto",
            });
            return;
        }
        if (compra.ley == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese la ley",
            });
            return;
        }
        if (compra.cotizacion == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese la cotizacion",
            });
            return;
        }
        // if (compra.anticipo == "") {
        //     Toast.fire({
        //         icon: "error",
        //         title: "Ingrese el anticipo",
        //     });
        //     return;
        // }
        if (compra.descuento == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese el descuento",
            });
            return;
        }
        if (compra.fecha == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese la fecha",
            });
            return;
        }
        if (compra.variable == "") {
            Toast.fire({
                icon: "error",
                title: "Ingrese el estavalor variable",
            });
            return;
        }

        compra.iddos = uniqueId("dos");
        console.log(compra);
        compras = [...compras, compra];
        //limpiar campos
        compra = {
            pesobruto: "",
            ley: "",
            // pesofino: "",
            //  onza: "",
            cotizacion: "",
            // onzados: "",
            // preciounitario: "",
            //costo: "",
            descuento: "",
            anticipo: "",
            variable: 31.104,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            estado: false,
        };
        Toast.fire({
            icon: "success",
            title: "Registrado",
        });
    };
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

    const eliminarcompra = (iddos) => {
        Swal.fire({
            title: "Estas seguro?",
            text: "Se eliminara compra del sistema!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "Your file has been deleted.", "success");

                //firebase
                compras = compras.filter((r) => r.iddos !== iddos);
                //end firebase
            }
        });
    };
    const modificarcompra = () => {
        console.log(iddos);
        console.log(cotizacion);

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

        let costomod = (compra.pesobruto * preciounitariomod).toFixed(2);

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

    const guardar = async () => {
        if (compras.length == 0) {
            Toast.fire({
                icon: "error",
                title: "No hay compras para guardar",
            });
            return;
        }
        if (idcliente == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar Cliente",
            });
            return;
        }

        const numfac = await firebaseNumeroFac();

        let recibo = {
            numerorecibo: numfac.length + 1,
            motoTotal: total(compras),
            anticipo: anticipar == "" ? 0 : anticipar,
            saldo: total(compras) - anticipar,
            totalOnza: parseFloat(totalonza(compras)),
            totalPesofino: parseFloat(totalpesofino(compras)),
            totalpesoBruto: parseFloat(totalpesobruto(compras)),
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            id_cli: idcliente,
            nombre_cli: nombrecliente,
            celular_cli: "",
            ci_cli: busquedaCi.ci,
            id_us: userdos.id,
            nombre_us: userdos.nombre,
            estado: false, // estado de venta y compra
            estadonuevo: compras[0].estado,
        };

        try {
            const docRef = await addDoc(collection(db, "recibo"), recibo);
            recibo.id = docRef.id;
            //guardar compras con el id del recibo
            compras.map(async (r) => {
                r.idrecibo = docRef.id;
                try {
                    await addDoc(collection(db, "compras"), r);
                    console.log("agregado");
                } catch (e) {
                    console.error("Error compra adding document: ", e);
                }
            });

            //end guardar compras

            console.log("Document recibo written with ID: ", docRef.id);
            //mensaje de registro de cliente
            //*end mensaje de registro*//
            //dirigir a recibo

            navigate(`/recibo?q=${docRef.id}`, { replace: true });
        } catch (e) {
            console.error("Error recibo adding document: ", e);
        }

        //actualizar onza compra
        //datos
        let idOnza = "Gp3cgox8S3eC51shPVTn";
        const washingtonRef = doc(db, "onza", idOnza);
        await updateDoc(washingtonRef, {
            venta: myRound(datos.venta + parseFloat(totalonza(compras))),
        });

        console.log(recibo);
    };

    function myRound(num, dec) {
        var exp = Math.pow(10, dec || 2); // 2 decimales por defecto
        return parseInt(num * exp, 10) / exp;
    }
    //mayusculas
    //mayusculas
    function uppercase(node) {
        const transform = () => (node.value = node.value.toUpperCase());

        node.addEventListener("input", transform, { capture: true });

        transform();
    }

    ///////clientes
    //cargar usuario registrados

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

    let idcliente = "";
    let nombrecliente = "";
    const seleccionarCliente = () => {
        /* Para obtener el valor */
        var cod = document.getElementById("clientenew").value;

        idcliente = cod;
        /* Para obtener el texto */
        var combo = document.getElementById("clientenew");
        var selected = combo.options[combo.selectedIndex].text;
        nombrecliente = selected;
    };
</script>

<div class="row page-titles">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active">
            <Link to="/compra">Compra</Link>
        </li>
        <li class="breadcrumb-item">
            <Link to="/venta">Venta</Link>
        </li>
    </ol>
</div>
<div class="row">
    <Oro />
    <Onza />
</div>

<!-- <div class="header-left">
    <div class="nav-item">
        <div class="input-group search-area">
            <input
                type="text"
                class="form-control"
                placeholder="Buscar Cliente por C.I."
                bind:value={busquedaCi.ci}
                on:change={buscarClienteCi}
            />
            <span class="input-group-text"
                ><a href="javascript:void(0)"
                    ><i class="flaticon-381-search-2" /></a
                ></span
            >
        </div>
    </div>
</div> -->

<div class="row">
    <div class="col-xl-12 col-lg-12">
        <div class="card">
            <div class="card-header d-block">
                <h4 class="card-title">Venta</h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="mb-3 col-md-3">
                                <label class="form-label"><b>Estado</b> </label>
                                <div class="mb-3 mb-0">
                                    <label class="radio-inline me-3"
                                        ><input
                                            type="radio"
                                            name="optradio"
                                            value={true}
                                            bind:group={compra.estado}
                                        /> Abierto</label
                                    >
                                    <label class="radio-inline me-3"
                                        ><input
                                            type="radio"
                                            name="optradio"
                                            value={false}
                                            bind:group={compra.estado}
                                        /> Cerrado</label
                                    >
                                </div>
                            </div>
                            <div class="mb-3 col-md-3">
                                <label class="form-label"><b>Fecha</b></label>
                                <input
                                    type="date"
                                    class="form-control"
                                    placeholder="Fecha"
                                    bind:value={compra.fecha}
                                />
                            </div>
                            <div class="mb-3 col-md-3">
                                <label class="form-label"
                                    ><b>Peso bruto</b></label
                                >
                                <input
                                    type="number"
                                    step="any"
                                    class="form-control"
                                    placeholder="0.00"
                                    bind:value={compra.pesobruto}
                                />
                            </div>
                            <div class="mb-3 col-md-3">
                                <label><b>Ley</b></label>
                                <input
                                    type="number"
                                    step="any"
                                    class="form-control"
                                    placeholder="0.00"
                                    bind:value={compra.ley}
                                />
                            </div>
                            <div class="mb-3 col-md-3">
                                <label><b>Cotizacion</b></label>
                                <input
                                    type="number"
                                    class="form-control"
                                    placeholder="0.00"
                                    bind:value={compra.cotizacion}
                                />
                            </div>
                            <div class="mb-3 col-md-3">
                                <label><b>Descuento %</b></label>
                                <input
                                    type="number"
                                    class="form-control"
                                    placeholder="0.00"
                                    bind:value={compra.descuento}
                                />
                            </div>
                            {#if compra.estado}
                                <div class="mb-3 col-md-3">
                                    <label><b>Anticipo %</b></label>
                                    <input
                                        type="number"
                                        class="form-control"
                                        placeholder="0.00"
                                        bind:value={compra.anticipo}
                                    />
                                </div>
                            {:else}
                                <div class="mb-3 col-md-3">
                                    <label><b>Anticipo %</b></label>
                                    Anticipo 100%
                                </div>
                            {/if}

                            <div class="mb-3 col-md-3">
                                <label><b>Valor variable</b></label>
                                <input
                                    type="number"
                                    step="any"
                                    class="form-control"
                                    placeholder="0.00"
                                    bind:value={compra.variable}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="table-responsive">
                            <table
                                class="table table-bordered table-responsive-sm"
                                style="zoom: 80%;"
                            >
                                <thead class="thead-info">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>---------</th>
                                        <th>Peso bruto</th>
                                        <th>Ley</th>
                                        <th>Peso fino</th>
                                        <th>ONZA</th>
                                        <th>Cotizacion</th>
                                        <th>ONZA</th>
                                        <th>P. UNIT</th>
                                        <th class="table-info">Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td
                                            >{compra.fecha}

                                            {#if compra.estado}
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
                                            Anticipo: {compra.anticipo}
                                            %
                                            <br />
                                            descuento: {compra.descuento}
                                            %
                                        </td>
                                        <td>{compra.pesobruto}</td>
                                        <td>{compra.ley} %</td>
                                        <td>{compra.pesofino}</td>
                                        <td>{compra.onza}</td>
                                        <td>{compra.cotizacion}</td>
                                        <td>{compra.onzados}</td>
                                        <td>{compra.preciounitario}</td>
                                        <td>{compra.costo}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12">
                        <button on:click={addCompra} class="btn btn-primary"
                            >Registrar</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-12 col-lg-12">
        <div class="row">
            <div class="col-lg-12">
                <div class="card mt-3">
                    <!-- <div class="card-header">
                        <div>
                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                on:click={guardar}>Guardar</button
                            >

                            
                            <button
                                type="button"
                                class="btn btn-success mb-2 btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                >Anticipo</button
                            >
                        </div>
                        <strong
                            >{moment(new Date()).format("yyyy-MM-DD")}</strong
                        >

                        <span class="float-end">
                            <strong>Status:</strong> Pending</span
                        >
                    </div> -->
                    <div class="card-body">
                        <div class="row mb-5">
                            <div
                                class="mt-4 col-xl-3 col-lg-3 col-md-6 col-sm-12"
                            >
                                <br />
                                <br />

                                <div>Señor(es): {nombrecliente}</div>
                                <!-- <div>C.I.: {busquedaCi.ci}</div>
                                <div>Celular: {busquedaCi.celular}</div> -->
                                <div>
                                    Fecha: {moment(new Date()).format(
                                        "yyyy-MM-DD"
                                    )}
                                </div>
                            </div>
                            <div
                                class="mt-4 col-xl-3 col-lg-3 col-md-6 col-sm-12"
                            />
                            <div
                                class="mt-4 col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex justify-content-lg-end justify-content-md-center justify-content-xs-start"
                            >
                                <div class="row align-items-center">
                                    <div class="col-12">
                                        <div class="brand-logo mb-3">
                                            <img
                                                class="logo-abbr me-2"
                                                width="100"
                                                src="./images/oro.png"
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
                                                >Nro. ###########</strong
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
                            <table class="table table-striped">
                                <thead class="thead-info">
                                    <tr style="zoom:80%">
                                        <th>Fecha</th>
                                        <th>---------</th>
                                        <th>Peso bruto</th>
                                        <th>Ley</th>
                                        <th>Peso fino</th>
                                        <th>ONZA</th>
                                        <th>Cotizacion</th>
                                        <th>ONZA</th>
                                        <th>P. UNIT</th>
                                        <th>Costo</th>
                                        <th />
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
                                            <td>{r.onza}</td>
                                            <td>{r.cotizacion}</td>
                                            <td>{r.onzados}</td>
                                            <td>{r.preciounitario}</td>
                                            <td class="table-info">{r.costo}</td
                                            >
                                            <td>
                                                <div class="d-flex">
                                                    {#if r.estado}
                                                        <button
                                                            on:click={() => {
                                                                iddos = r.iddos;
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

                                                    <button
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
                                                    >
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                    <tr class="table-dark">
                                        <td>Total</td>
                                        <td />
                                        <td
                                            >{totalpesobruto(compras).toFixed(
                                                2
                                            )}</td
                                        >
                                        <td />
                                        <td
                                            >{totalpesofino(compras).toFixed(
                                                2
                                            )}</td
                                        >
                                        <td>{totalonza(compras).toFixed(2)}</td>
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
                                <table class="table table-clear">
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
                                                ><strong>Anticipo</strong></td
                                            >
                                            <td class="right">$ {anticipar}</td>
                                        </tr>

                                        <tr>
                                            <td class="left"
                                                ><strong>Saldo</strong></td
                                            >
                                            <td class="right"
                                                ><strong
                                                    >$ {total(compras).toFixed(
                                                        2
                                                    ) - anticipar}</strong
                                                ><br />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card-header">
                        <div class="nav-item">
                            <!-- <div class="">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Buscar Cliente por C.I."
                                    bind:value={busquedaCi.ci}
                                    on:change={buscarClienteCi}
                                    use:uppercase
                                />
                            </div> -->
                            <div class="mb-3">
                                <label class="form-label"
                                    >Seleccionar cliente</label
                                >
                                <select
                                    id="clientenew"
                                    class="  form-control input-rounded mb-3"
                                    on:change={() => seleccionarCliente()}
                                >
                                    {#each clientes as r}
                                        <option value={r.id}>{r.nombre}</option>
                                    {:else}
                                        <option value="0"
                                            >Seleccionar Usuario</option
                                        >
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <strong
                            >{moment(new Date()).format("yyyy-MM-DD")}</strong
                        >

                        <div>
                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                on:click={guardar}>Guardar</button
                            >

                            <!-- <button type="button" class="btn btn-danger btn-sm"
                                >PDF</button
                            >

                            <button type="button" class="btn btn-dark btn-sm"
                                >Nuevo</button
                            > -->

                            <!-- Button trigger modal -->
                            <button
                                type="button"
                                class="btn btn-success mb-2 btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCenter"
                                >Anticipo</button
                            >
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
                    <!-- <div class="mb-3 col-md-3">
                        <label class="form-label"><b>Estado</b> </label>
                        <div class="mb-3 mb-0">
                            <label class="radio-inline me-3"
                                ><input
                                    type="radio"
                                    name="optradiodos"
                                    value={true}
                                    bind:group={estadodos}
                                /> Abierto</label
                            >
                            <label class="radio-inline me-3"
                                ><input
                                    type="radio"
                                    name="optradiodos"
                                    value={false}
                                    bind:group={estadodos}
                                /> Cerrado</label
                            >
                        </div>
                    </div> -->
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
                <div class="mb-3 col-md-6">
                    <label class="form-label"><b>Dar un anticipo</b></label>
                    <input
                        type="number"
                        step="any"
                        class="form-control"
                        placeholder="0.00"
                        bind:value={anticipar}
                    />
                </div>
            </div>
            <div class="modal-footer">
                <button
                    on:click={() => (anticipar = 0)}
                    type="button"
                    class="btn btn-danger light"
                    data-bs-dismiss="modal">Cerrar</button
                >
                <button
                    type="button"
                    class="btn btn-primary light"
                    data-bs-dismiss="modal">Guardar</button
                >
            </div>
        </div>
    </div>
</div>
