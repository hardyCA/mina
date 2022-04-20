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

export const buscarClienteFirebase = async (ci) => {
    let data = [];
    const q = query(
        collection(db, "cliente"),
        where("ci", "==", ci)
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