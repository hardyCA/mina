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