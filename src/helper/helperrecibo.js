import {
    addDoc,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    doc,
    orderBy,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import db from "../firebase";

export const buscarReciboFirebase = async (id) => {
    let data = {}
    const docRef = doc(db, "recibo", id);
    const docSnap = await getDoc(docRef);
    data = docSnap.data()
    return data;
}
export const buscarComprasFirebase = async (id) => {
    let data = [];
    const q = query(
        collection(db, "compras"),
        where("idrecibo", "==", id)
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

export const buscarComprasFirebaseCliente = async (id, desde, asta, estadonuevo) => {
    let data = [];
    let q
    if (estadonuevo === 1) {
        q = query(
            collection(db, "compras"),

            where("idcliente", "==", id),
            where("fecha", ">=", desde),
            where("fecha", "<=", asta),
            orderBy("fecha")
        );
    } else if (estadonuevo === true) {
        q = query(
            collection(db, "compras"),
            where("estado", "==", true),
            where("idcliente", "==", id),
            where("fecha", ">=", desde),
            where("fecha", "<=", asta),
            orderBy("fecha")
        );
    } else {
        q = query(
            collection(db, "compras"),
            where("estado", "==", false),
            where("idcliente", "==", id),
            where("fecha", ">=", desde),
            where("fecha", "<=", asta),
            orderBy("fecha")
        );
    }



    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
}