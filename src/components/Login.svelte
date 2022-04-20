<script>
    import {
        addDoc,
        collection,
        getDocs,
        query,
        where,
        doc,
        orderBy,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { user } from "../stores/User";
    $: onMount(() => {
        if (localStorage.getItem("io")) {
            navigate("/", { replace: true });
        } else {
        }
    });

    let data = { usuario: "", password: "" };

    const login = async () => {
        let datanew = [];
        const q = query(
            collection(db, "usuario"),
            where("usuario", "==", data.usuario),
            where("password", "==", data.password)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            datanew.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        if (datanew.length == 0) {
            console.log("usuario no existente");
        } else {
            await localStorage.setItem("usuario", JSON.stringify(datanew[0]));
            await localStorage.setItem("io", JSON.stringify(true));
            await user.setUser(datanew[0]);
            navigate("/", { replace: true });
        }
    };
</script>

<div class="authincation h-100">
    <div class="container h-100">
        <div class="row justify-content-center h-100 align-items-center">
            <div class="col-md-6">
                <div class="authincation-content">
                    <div class="row no-gutters">
                        <div class="col-xl-12">
                            <div class="auth-form">
                                <div class="text-center mb-3">
                                    <!-- <a href="index.html"
                                        ><img
                                            src="images/logo-full.png"
                                            alt=""
                                        /></a
                                    > -->
                                    <h1>CANAAN</h1>
                                </div>
                                <h4 class="text-center mb-4">
                                    Inicia sesión en tu cuenta
                                </h4>
                                <form on:submit|preventDefault={() => login()}>
                                    <div class="mb-3">
                                        <!-- svelte-ignore a11y-label-has-associated-control -->
                                        <label class="mb-1"
                                            ><strong>Usuario</strong></label
                                        >
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="hello@example.com"
                                            bind:value={data.usuario}
                                        />
                                    </div>
                                    <div class="mb-3">
                                        <!-- svelte-ignore a11y-label-has-associated-control -->
                                        <label class="mb-1"
                                            ><strong>Password</strong></label
                                        >
                                        <input
                                            type="password"
                                            class="form-control"
                                            placeholder="Password"
                                            bind:value={data.password}
                                        />
                                    </div>

                                    <div class="text-center">
                                        <button
                                            type="submit"
                                            class="btn btn-primary btn-block"
                                            >Entrar</button
                                        >
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
