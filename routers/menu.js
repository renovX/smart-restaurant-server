import express from 'express'
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import db from '../config.js'


const foodRouter = express.Router()

foodRouter.use('/add-item', async (req, res) => {
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
        }
        else {
            const addedFood = await setDoc(typeDoc, {
                foods: arrayUnion(addingReference.id)
            })
        }
        // console.log(addedFood.id)
        // const foodExtendingReference = await setDoc
        // console.log(addingReference.id)
        // const typeCollection = collection(db, 'types', type, 'foods')
        // const addingReference2 = await addDoc(typeCollection, {
        //     id: addingReference.id
        // })
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

})

export default foodRouter