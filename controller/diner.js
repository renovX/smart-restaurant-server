import { getDocs, collection, getDoc, doc, addDoc } from 'firebase/firestore'
import db from '../config.js'

const dinerController = {
    getMenuItemTypes: async (req, res) => {
        try {
            const typesCollection = collection(db, "types")
            const typesSnap = await getDocs(typesCollection)
            console.log(typesSnap)
            const typeNames = Array()
            typesSnap.forEach(doc => {
                typeNames.push(doc.id)
            })
            res.send(typeNames)
        }
        catch (err) {
            res.send('error')

        }
    },
    getFoods: async (req, res) => {
        const { type } = req.params
        try {
            const typeCollection = collection(db, 'types')
            const typeDocRef = doc(typeCollection, type)
            const typeDocSnap = await getDoc(typeDocRef)
            if (typeDocSnap.exists()) {
                const foodRefs = typeDocSnap.data().foods
                const foodItems = await Promise.all(foodRefs.map(async foodRef => {
                    const foodDoc = doc(db, 'foods', foodRef)
                    const foodItem = (await getDoc(foodDoc)).data()
                    return foodItem
                }))
                res.send(foodItems)
            }
            else {
                console.log('no data')
            }
        }
        catch (err) {
            console.log(err)
            res.send('error')

        }
    },
    placeOrder: async (req, res) => {
        try {
            const { dinerName, dinerPhoneNumber, orderedItems, price } = req.body
            const data = req.body
            const orderList = orderedItems.map(item => ({
                referenceId: item.referenceId,
                name: item.name,
                quantity: item.quantity,
            }))

            const orderedItemsPrices = await Promise.all(orderList.map(async orderedItem => {
                return (await getDoc(doc(db, 'foods', orderedItem.referenceId))).data().price * orderedItem.quantity
            }))

            const calculatedPrice = orderedItemsPrices.reduce((total, current) => total + current)
            if (price !== calculatedPrice) {
                console.log(calculatedPrice)
                res.send('order not placed')
            } else {
                const ordersCollection = collection(db, 'orders')
                const orderAddingReference = (await addDoc(ordersCollection, { phoneNumber: dinerPhoneNumber })).id

                const ordersSubCollection = collection(ordersCollection, orderAddingReference, 'orderItems')
                const subCollectionOrdersReferences = await Promise.all(orderList.map(async item => (
                    (await addDoc(ordersSubCollection, item)).id
                )))
                console.log(subCollectionOrdersReferences)

                const usersCollection = collection(db, 'users')
                const usersOrdersSubCollection = collection(usersCollection, dinerPhoneNumber, "orders")

                const userData = {
                    user: dinerName,
                    orderId: orderAddingReference,
                    pricePaid: calculatedPrice
                }

                const usersOrdersReference = (await addDoc(usersOrdersSubCollection, userData)).id

                // const userOrdersSubCollection = collection()
            }
        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    }
}

export default dinerController