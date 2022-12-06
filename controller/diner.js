import { ObjectID } from 'bson';
import db from '../config.js'

const dinerController = {
    getMenuItemTypes: async (req, res) => {
        try {
            const typesCollection = db.collection('types');
            const typesArray = await typesCollection.find({}).toArray()

            const typeIds = typesArray.map(type => type._id)
            res.status(200).send(typeIds)
        }
        catch (err) {
            res.status(500).send('error')

        }
    },
    getFoods: async (req, res) => {
        const { type } = req.params
        try {
            const arr = await db.collection('types').findOne({ _id: type })

            if (!arr) {
                res.status(400).send('No such type')
            }
            else {
                const foodIds = arr.foodList

                const foodMaps = await Promise.all(foodIds.map(async foodId =>
                    await db.collection('foods').findOne({ _id: foodId })
                ))
                res.send(foodMaps)
            }


        }
        catch (err) {
            console.log(err)
            res.status(500).send('error')

        }
    },
    placeOrder: async (req, res) => {
        try {
            const { dinein, dinerName, dinerPhoneNumber, orderedItems, price, table } = req.body

            const orderList = orderedItems.map(item => ({
                referenceId: item.referenceId,
                name: item.name,
                quantity: item.quantity,
            }))
            const foodMaps = await Promise.all(orderList.map(async food =>
                (await db.collection('foods').findOne({ _id: ObjectID(food.referenceId) })).price * food.quantity
            ))
            const calculatedPrice = foodMaps.reduce((total, current) => total + current)

            if (price !== calculatedPrice) {
                res.status(409).send('Order not placed')
            }
            else {
                const placedOrder = await db.collection('orders').insertOne({ ordersItems: orderList, table: table, dinein: dinein })
                const orderId = placedOrder.insertedId

                const userData = {
                    user: dinerName,
                    orderId: orderId,
                    pricePaid: calculatedPrice
                }

                const userDocument = await db.collection('users').findOne({ _id: dinerPhoneNumber })

                if (!userDocument) {
                    await db.collection('users').insertOne({ _id: dinerPhoneNumber, orderList: [{ name: dinerName, orderId: orderId }] })
                }
                else {
                    await db.collection('users').updateOne({ _id: dinerPhoneNumber }, { $push: { orderList: { name: dinerName, orderId: orderId } } })
                }
                res.status(200).send("OK")
            }

        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}

export default dinerController