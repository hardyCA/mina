
import {
    collection,
    query,
    orderBy,
    where,
    startAt,
    getDocs,
    endBefore,
    onSnapshot,
} from "firebase/firestore";
import { subscribe } from "svelte/internal";
import db from "../firebase";

export const buscarNombre = async (databusquedanombre) => {
    let data = []
    const q = await query(
        collection(db, "recibo"),
        orderBy("nombre_cli"),
        orderBy("numerorecibo"),

        startAt(databusquedanombre),
        endBefore(databusquedanombre + "\uf8ff")
    );

    // await onSnapshot(q, (querySnapshot) => {
    //     const productos = [];
    //     querySnapshot.forEach((doc) => {
    //         productos.push({
    //             id: doc.id,
    //             ...doc.data(),
    //         });
    //     });
    //     console.log("DENTRO suscribete", productos);
    //     data = productos;
    // });

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    console.log(data)
    return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
}

export const buscarCi = async (databusquedaci) => {
    let data = []
    const q = await query(
        collection(db, "recibo"),
        orderBy("ci_cli"),
        orderBy("numerorecibo"),

        startAt(databusquedaci),
        endBefore(databusquedaci + "\uf8ff")
    );

    // await onSnapshot(q, (querySnapshot) => {
    //     const productos = [];
    //     querySnapshot.forEach((doc) => {
    //         productos.push({
    //             id: doc.id,
    //             ...doc.data(),
    //         });
    //     });
    //     console.log("DENTRO suscribete", productos);
    //     data = productos;
    // });

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    console.log(data)
    return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
}


/////////////////dos
export const buscarporfecha = async (estado, desde, asta) => {
    let data = []
    let q
    if (estado === 1) {
        q = await query(
            collection(db, "recibo"),
            where("fecha", ">=", desde),
            where("fecha", "<=", asta),
        );

    } else {
        q = await query(
            collection(db, "recibo"),
            where("fecha", ">=", desde),
            where("fecha", "<=", asta),
            where("estado", "==", estado),

        );
    }




    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    console.log(data)
    return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
}

export const buscarMonto = async () => {
    // let data = []
    // let q = await query(
    //     collection(db, "monto"))

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     data.push({
    //         id: doc.id,
    //         ...doc.data(),
    //     });
    // });

    // // console.log(data)
    // return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
    const productos = [];
    const q = query(collection(db, "monto"));

    onSnapshot(q, (querySnapshot) => {

        querySnapshot.forEach((doc) => {
            productos.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log("DENTRO suscribete", productos);
        datos = productos;

    });
    return productos


}


export const buscarporfechaCajaChica = async (desde, asta) => {
    let data = []
    let q = await query(
        collection(db, "caja"),


        where("fecha", ">=", desde),
        where("fecha", "<=", asta),
        orderBy("fecha"),
    );

    //



    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    console.log(data)
    return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
}

export const buscarClienteFirebase = async (id_cli, desde, asta) => {
    let data = [];
    const q = query(
        collection(db, "recibo"),
        where("id_cli", "==", id_cli),
        where("estado", "==", true),
        where("fecha", ">=", desde),
        where("fecha", "<=", asta),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
}

export const buscarClienteFirebasedos = async (id_cli, desde, asta) => {
    let data = [];
    const q = query(
        collection(db, "recibo"),
        where("id_cli", "==", id_cli),
        where("estado", "==", false),
        where("fecha", ">=", desde),
        where("fecha", "<=", asta),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
}