import { addDoc, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc, deleteDoc, collection } from "firebase/firestore";
import db from '../config.js'
const adminController = {

    addFood: async (req, res) => {
        const { name, price, description, type } = req.body
        const foodItem = req.body
        try {
            const foodsCollection = collection(db, 'foods')
            const addingReference = await addDoc(foodsCollection, foodItem)

            const typesCollection = collection(db, 'types')
            const typeDoc = doc(db, 'types', type)
            const docSnap = await getDoc(typeDoc)
            if (docSnap.exists()) {
                const addedFood = await updateDoc(typeDoc, {
                    foods: arrayUnion(addingReference.id)
                })
            } else {
                const addedFood = await setDoc(typeDoc, {
                    foods: arrayUnion(addingReference.id)
                })
            }
            res.send({
                id: addingReference.id,
                message: 'Success'
            })
        }
        catch (e) {
            console.log(e)
            res.send({
                message: 'Success',
                error: e
            })
        }

    },
    removeFood: async (req, res) => {
        const ref = req.body.referenceId;
        const foodDocRef = doc(db, 'foods', ref);

        try {
            const docSnap = await getDoc(foodDocRef)
            if (docSnap.exists()) {

                const type = docSnap.data().type;
                await deleteDoc(foodDocRef);
                const typeDocRef = doc(db, 'types', type);
                updateDoc(typeDocRef, { foods: arrayRemove(ref) });
                res.send("deleted")

            }
            else {
                console.log("Food not found");
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    updateFood: async (req, res) => {
        const { refId, name, price, description } = req.body;
        const foodDocRef = doc(db, 'foods', refId);
        updateDoc(foodDocRef, {
            name: name,
            price: price,
            description: description
        });
    }
}
export default adminController