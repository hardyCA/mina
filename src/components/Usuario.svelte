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

    let usuario = {
        nombre: "",
        celular: "",
        usuario: "",
        password: "",
        estado: true,
        fecha: moment(new Date()).format("yyyy-MM-DD"),
        rol: "",
    };
    let usuarios = [];
    //cargar usuario registrados
    let carga = false;
    const loadUsuario = async () => {
        let data = [];
        const querySnapshot = await getDocs(collection(db, "usuario"));
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        usuarios = data;
        carga = true;
        console.log(usuarios);
    };
    onMount(async () => {
        await loadUsuario();
    });
    // agregar usuario
    const addUsuario = async () => {
        //validar formulario de usuario
        if (usuario.nombre == "") {
            Toast.fire({
                icon: "error",
                title: "El campo nombre es obligatorio",
            });
            return;
        }
        // if (usuario.celular.length != 8) {
        //     Toast.fire({
        //         icon: "error",
        //         title: "El campo celular es obligatorio",
        //     });
        //     return;
        // }
        if (usuario.usuario == "") {
            Toast.fire({
                icon: "error",
                title: "El campo usuario es obligatorio",
            });
            return;
        }
        if (usuario.password == "") {
            Toast.fire({
                icon: "error",
                title: "El campo password es obligatorio",
            });
            return;
        }
        if (usuario.rol == "") {
            Toast.fire({
                icon: "error",
                title: "El campo rol es obligatorio",
            });
            return;
        }
        //add firebase
        try {
            const docRef = await addDoc(collection(db, "usuario"), usuario);
            usuario.id = docRef.id;
            usuarios = [...usuarios, usuario];
            console.log("Document written with ID: ", docRef.id);
            //mensaje de registro de cliente
            //*end mensaje de registro*//
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        //limpiar campos form
        usuario = {
            nombre: "",
            celular: "",
            usuario: "",
            password: "",
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            rol: "",
        };
        //mensaje
        Toast.fire({
            icon: "success",
            title: "Agregado con exito",
        });
    };
    //eliminar usuario
    const delUsuario = (id) => {
        Swal.fire({
            title: "Estas seguro?",
            text: "Se eliminara Usuario del sistema!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "Your file has been deleted.", "success");

                //firebase
                deleteDoc(doc(db, "usuario", id));
                usuarios = usuarios.filter((r) => r.id !== id);
                Toast.fire({
                    icon: "error",
                    title: "Eliminado con exito",
                });
                //end firebase
            }
        });
    };
    //mostrar usuario
    let estadoUsuario = true;
    const mostrarUsuario = (r) => {
        usuario = {
            id: r.id,
            nombre: r.nombre,
            celular: r.celular,
            usuario: r.usuario,
            password: r.password,
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            rol: r.rol,
        };
        estadoUsuario = false;
    };

    const modUsuario = async () => {
        //valigar
        if (usuario.nombre == "") {
            Toast.fire({
                icon: "error",
                title: "El campo nombre es obligatorio",
            });
            return;
        }
        // if (usuario.celular.length != 8) {
        //     Toast.fire({
        //         icon: "error",
        //         title: "El campo celular es obligatorio",
        //     });
        //     return;
        // }
        if (usuario.usuario == "") {
            Toast.fire({
                icon: "error",
                title: "El campo usuario es obligatorio",
            });
            return;
        }
        if (usuario.password == "") {
            Toast.fire({
                icon: "error",
                title: "El campo password es obligatorio",
            });
            return;
        }
        if (usuario.rol == "") {
            Toast.fire({
                icon: "error",
                title: "El campo rol es obligatorio",
            });
            return;
        }

        ///firebase
        console.log(usuario);
        const washingtonRef = doc(db, "usuario", usuario.id);
        await updateDoc(washingtonRef, {
            nombre: usuario.nombre,
            celular: usuario.celular,
            usuario: usuario.usuario,
            password: usuario.password,
            estado: true,
            rol: usuario.rol,
        });

        usuarios = usuarios.map((p) => {
            if (p.id == usuario.id) {
                return {
                    ...p,
                    nombre: usuario.nombre,
                    celular: usuario.celular,
                    usuario: usuario.usuario,
                    password: usuario.password,
                    estado: true,
                    rol: usuario.rol,
                };
            } else {
                return p;
            }
        });
        console.log(usuarios);
        usuario = {
            nombre: "",
            celular: "",
            usuario: "",
            password: "",
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            rol: "",
        };
        estadoUsuario = true;
        Toast.fire({
            icon: "success",
            title: "Modificado",
        });
    };
</script>

<div class="row page-titles">
    <ol class="breadcrumb">
        <li class="breadcrumb-item ">
            <Link to="/cliente">Cliente</Link>
        </li>
        <li class="breadcrumb-item active">
            <Link to="/usuario">Usuario</Link>
        </li>
    </ol>
</div>
<!-- row -->
<div class="row">
    <div class="col-xl-4 col-lg-4">
        <div class="card">
            <div class="card-header">
                {#if estadoUsuario}
                    <h4 class="card-title">Registro de Usuario</h4>
                {:else}
                    <h4 class="card-title">Modificar Usuario</h4>
                {/if}
            </div>
            <div class="card-body">
                <div class="basic-form">
                    <div class="mb-3">
                        <label class="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            class="form-control input-default "
                            placeholder="Nombre "
                            bind:value={usuario.nombre}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Numero de celular</label>
                        <input
                            type="number"
                            class="form-control input-rounded"
                            placeholder="Celular"
                            bind:value={usuario.celular}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nombre de usuario</label>
                        <input
                            type="text"
                            class="form-control input-rounded"
                            placeholder="usuario"
                            bind:value={usuario.usuario}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input
                            type="password"
                            class="form-control input-rounded"
                            placeholder="Contraseña"
                            bind:value={usuario.password}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Seleccionar Rol</label>
                        <select
                            class="  form-control input-rounded mb-3"
                            bind:value={usuario.rol}
                        >
                            <option value="Administrador"
                                >Administrador 1</option
                            >
                            <option value="Administrador"
                                >Administrador 2</option
                            >
                            <option value="Administrador"
                                >Administrador 3</option
                            >
                            <option value="Asistente">Asistente</option>
                            <option value="Invitado">Invitado</option>
                        </select>
                    </div>

                    {#if estadoUsuario}
                        <button
                            on:click={addUsuario}
                            class="btn btn-primary mb-2">Registrar</button
                        >
                    {:else}
                        <button
                            on:click={modUsuario}
                            class="btn btn-warning mb-2">Modificar</button
                        >
                        <button
                            on:click={() => {
                                usuario = {
                                    nombre: "",
                                    celular: "",
                                    usuario: "",
                                    password: "",
                                    estado: true,
                                    fecha: moment(new Date()).format(
                                        "yyyy-MM-DD"
                                    ),
                                    rol: "",
                                };
                                estadoUsuario = true;
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
                        <h4 class="card-title">Lista de Usuario</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table
                                class="table table-responsive-sm table-bordered"
                            >
                                <thead class="thead-info">
                                    <tr>
                                        <th><strong>#</strong></th>
                                        <th><strong>Nombre</strong></th>
                                        <th><strong>Celular</strong></th>
                                        <th><strong>Usuario</strong></th>

                                        <th><strong>Rol</strong></th>
                                        <th><strong /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if carga}
                                        {#each usuarios as r, i}
                                            <tr>
                                                <td><strong>{i + 1}</strong></td
                                                >
                                                <td>{r.nombre}</td>
                                                <td>{r.celular} </td>
                                                <td>{r.usuario}</td>

                                                <td>{r.rol}</td>
                                                <td>
                                                    <div class="d-flex">
                                                        <button
                                                            on:click={() =>
                                                                mostrarUsuario(
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
                                            <td colspan="7">
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
