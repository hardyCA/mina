<script>
    import { Link } from "svelte-routing";
    import moment from "moment";
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
    import Swal from "sweetalert2";
    import { onMount } from "svelte";
    import { Stretch } from "svelte-loading-spinners";
    import { buscarCi } from "../helper/helperBuscar";
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
    //end alertas
    let cliente = {
        nombre: "",
        ci: "",
        celular: "",
        estado: true,
        fecha: moment(new Date()).format("yyyy-MM-DD"),
    };
    let clientes = [];
    //cargar clientes registrados
    let carga = false;
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
        carga = true;
        console.log(clientes);
    };
    onMount(async () => {
        await loadClientes();
    });

    //agregar clientes
    //mayusculas
    function uppercase(node) {
        const transform = () => (node.value = node.value.toUpperCase());

        node.addEventListener("input", transform, { capture: true });

        transform();
    }

    const addCliente = async () => {
        //validar nombre
        if (cliente.nombre.length < 3) {
            Toast.fire({
                icon: "error",
                title: "El nombre debe tener al menos 3 caracteres",
            });
            return;
        }
        //validar cedula
        // if (cliente.ci == "") {
        //     Toast.fire({
        //         icon: "error",
        //         title: "La cedula es obligatoria",
        //     });
        //     return;
        // }
        let encontrado = await buscarCi(cliente.ci);
        console.log(encontrado);
        // if (encontrado.length != 0) {
        //     Toast.fire({
        //         icon: "error",
        //         title: "Cliente existente",
        //     });
        //     return;
        // }

        //validar celular
        // if (cliente.celular == "") {
        //     Toast.fire({
        //         icon: "error",
        //         title: "El celular es obligatorio",
        //     });
        //     return;
        // }

        console.log(cliente);
        //add firebase
        try {
            const docRef = await addDoc(collection(db, "cliente"), cliente);
            cliente.id = docRef.id;
            clientes = [...clientes, cliente];
            console.log("Document written with ID: ", docRef.id);
            //mensaje de registro de cliente
            //*end mensaje de registro*//
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        //limpiar campos
        cliente = {
            nombre: "",
            ci: "",
            celular: "",
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
        };
        //mensaje
        Toast.fire({
            icon: "success",
            title: "Agregado con exito",
        });
    };
    //eliminar cliente
    const delUsuario = (id) => {
        Swal.fire({
            title: "Estas seguro?",
            text: "Se eliminara cliente del sistema!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "Your file has been deleted.", "success");

                //firebase
                deleteDoc(doc(db, "cliente", id));
                clientes = clientes.filter((r) => r.id !== id);
                Toast.fire({
                    icon: "error",
                    title: "Eliminado con exito",
                });
                //end firebase
            }
        });
    };
    //modificar usuario
    let estadoCliente = true;
    const mostrarCliente = (r) => {
        console.log(r);
        cliente = {
            id: r.id,
            nombre: r.nombre,
            ci: r.ci,
            celular: r.celular,
            estado: true,
        };
        estadoCliente = false;
    };

    const modcliente = async () => {
        //validar nombre
        if (cliente.nombre.length < 3) {
            Toast.fire({
                icon: "error",
                title: "El nombre debe tener al menos 3 caracteres",
            });
            return;
        }
        //validar cedula
        // if (cliente.ci == "") {
        //     Toast.fire({
        //         icon: "error",
        //         title: "La cedula es obligatoria",
        //     });
        //     return;
        // }
        // let encontrado = buscarCi(cliente.ci);
        // console.log(encontrado);
        // if (encontrado.length != 0) {
        //     Toast.fire({
        //         icon: "error",
        //         title: "Cliente existente",
        //     });
        //     return;
        // }

        //validar celular
        // if (cliente.celular == "") {
        //     Toast.fire({
        //         icon: "error",
        //         title: "El celular es obligatorio",
        //     });
        //     return;
        // }

        console.log(cliente);
        const washingtonRef = doc(db, "cliente", cliente.id);
        await updateDoc(washingtonRef, {
            nombre: cliente.nombre,
            ci: cliente.ci,
            celular: cliente.celular,
            estado: true,
        });

        clientes = clientes.map((p) => {
            if (p.id == cliente.id) {
                return {
                    ...p,
                    nombre: cliente.nombre,
                    ci: cliente.ci,
                    celular: cliente.celular,
                    estado: true,
                };
            } else {
                return p;
            }
        });
        console.log(clientes);
        cliente = {
            nombre: "",
            ci: "",
            celular: "",
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
        };
        estadoCliente = true;
        Toast.fire({
            icon: "success",
            title: "Modificado",
        });
    };
</script>

<div class="row page-titles">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active">
            <Link to="/cliente">Cliente</Link>
        </li>
        <li class="breadcrumb-item">
            <Link to="/usuario">Usuario</Link>
        </li>
    </ol>
</div>
<!-- row -->
<div class="row">
    <div class="col-xl-4 col-lg-4">
        <div class="card">
            <div class="card-header">
                {#if estadoCliente}
                    <h4 class="card-title">Registro de Cliente</h4>
                {:else}
                    <h4 class="card-title">Modificar Cliente</h4>
                {/if}
            </div>
            <div class="card-body">
                <div class="basic-form">
                    <div class="mb-3">
                        <label class="form-label"
                            >Nombre Completo de Cliente</label
                        >
                        <input
                            type="text"
                            id="nombre"
                            class="form-control input-default "
                            placeholder="Nombre "
                            bind:value={cliente.nombre}
                            use:uppercase
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">C.I. mas Extencion</label>
                        {#if estadoCliente}
                            <input
                                type="text"
                                class="form-control input-rounded"
                                placeholder="Ejemplo 123456LP"
                                bind:value={cliente.ci}
                                use:uppercase
                            />
                        {:else}
                            <input
                                type="text"
                                class="form-control input-rounded"
                                placeholder="Ejemplo 123456LP"
                                bind:value={cliente.ci}
                                use:uppercase
                                disabled
                            />
                        {/if}
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nro. Celular</label>
                        <input
                            type="number"
                            class="form-control input-rounded"
                            placeholder="Numero de Celular"
                            bind:value={cliente.celular}
                        />
                    </div>

                    {#if estadoCliente}
                        <button
                            on:click={addCliente}
                            class="btn btn-primary mb-2">Registrar</button
                        >
                    {:else}
                        <button
                            on:click={modcliente}
                            class="btn btn-warning mb-2">Modificar</button
                        >
                        <button
                            on:click={() => {
                                cliente = {
                                    nombre: "",
                                    ci: "",
                                    celular: "",
                                    estado: true,
                                    fecha: moment(new Date()).format(
                                        "yyyy-MM-DD"
                                    ),
                                };
                                estadoCliente = true;
                            }}
                            class="btn btn-dark mb-2">Nuevo</button
                        >
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-8 col-lg-8">
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Lista de clientes</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-responsive-md">
                                <thead class="thead-info">
                                    <tr>
                                        <th>#</th>
                                        <th><strong>Nombre completo</strong></th
                                        >
                                        <th><strong>C.I.</strong></th>
                                        <th><strong>Celular</strong></th>
                                        <th><strong>estado</strong></th>
                                        <th><strong /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if carga}
                                        {#each clientes as r, i}
                                            <tr>
                                                <td><strong>{1 + i}</strong></td
                                                >
                                                <td>{r.nombre}</td>
                                                <td>{r.ci}</td>
                                                <td>{r.celular}</td>
                                                <td>{r.estado}</td>
                                                <td>
                                                    <div class="d-flex">
                                                        <button
                                                            on:click={() =>
                                                                mostrarCliente(
                                                                    r
                                                                )}
                                                            class="btn btn-primary shadow btn-xs sharp me-1"
                                                            ><i
                                                                class="fa fa-pencil"
                                                            /></button
                                                        >
                                                        <button
                                                            on:click={() =>
                                                                delUsuario(
                                                                    r.id
                                                                )}
                                                            class="btn btn-danger shadow btn-xs sharp"
                                                            ><i
                                                                class="fa fa-trash"
                                                            /></button
                                                        >
                                                    </div>
                                                </td>
                                            </tr>
                                        {/each}
                                    {:else}
                                        <tr>
                                            <td colspan="6">
                                                <center>
                                                    <Stretch
                                                        size="60"
                                                        color="#FF3E00"
                                                        unit="px"
                                                        duration="1s"
                                                    />
                                                </center>
                                            </td>
                                        </tr>
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
