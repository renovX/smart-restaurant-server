import { ObjectId } from "mongodb"
import db from '../config.js'


const adminController = {

    addFood: async (req, res) => {

        const { name, price, description, type, veg, image } = req.body

        try {
            const foodDoc = await db.collection('foods').insertOne({ name, description, price, type, veg, image })

            const typeDoc = await db.collection('types').findOne({ _id: type })
            if (typeDoc) {
                await db.collection('types').updateOne({ _id: type }, { $push: { foodList: ObjectId(foodDoc.insertedId) } })
            }
            else {
                await db.collection('types').insertOne({ _id: type, foodList: [foodDoc.insertedId] })
            }

            res.status(200).send({
                id: foodDoc.insertedId,
                message: 'OK'
            })


        }
        catch (e) {
            res.status(500).send({
                message: 'Success',
                error: e
            })
        }

    },

    removeFood: async (req, res) => {

        const foodId = ObjectId(req.body.id);

        const foodDoc = await db.collection('foods').findOne({ _id: foodId })
        try {
            const foodType = foodDoc.type

            await db.collection('foods').deleteOne({ _id: foodId }, (err, res) => { console.log(res) })
            await db.collection('types').updateOne({ _id: foodType }, { $pull: { foodList: foodId } })

            const typeDocument = await db.collection('types').findOne({ _id: foodType })

            if (typeDocument.foodList.length === 0) {
                await db.collection('types').deleteOne({ _id: foodType })
            }

            res.status(200).send({
                message: "OK"
            })

        }

        catch (err) {
            console.log(err);
            res.status(500).send({
                message: "Server error",
                error: err
            })
        }
    },

    updateFood: async (req, res) => {
        try {
            const { id, name, price, description, veg, image, type } = req.body;

            const foodId = ObjectId(id);

            const foodItem = await db.collection('foods').findOne({ _id: foodId })
            if (foodItem.type !== type) {
                await db.collection('types').updateOne({ _id: foodItem.type }, { $pull: { foodList: foodId } })
                const typeDoc = await db.collection('types').findOne({ _id: type })
                if (typeDoc) {
                    await db.collection('types').updateOne({ _id: type }, { $push: { foodList: foodId } })

                }
                else {
                    await db.collection('types').insertOne({ _id: type, foodList: [foodId] })
                }

                const orignalType = await db.collection('types').findOne({ _id: foodItem.type })
                if (orignalType.foodList.length === 0) {
                    await db.collection('types').deleteOne({ _id: foodItem.type })
                }
            }
            await db.collection('foods').updateOne({ _id: foodId }, { $set: { name, price, description, veg, image, type } })

            res.status(200).send('OK')
        }
        catch (e) {
            console.log(e)
            res.status(500).send('Server error')
        }

    },

    getAllFoods: async (req, res) => {
        try {
            const typesCollection = await db.collection('types')

            const typesArray = await typesCollection.find({}).toArray()

            const foods = {}

            await Promise.all(typesArray.map(async type => {
                foods[type._id] = await Promise.all(type.foodList.map(async foodId => {
                    const { _id, ...foodDoc } = await db.collection('foods').findOne({ _id: foodId })
                    return { id: foodId, ...foodDoc }
                }))
                return foods[type._id]
            }))

            res.send({
                menu: foods,
                message: "OK"
            })

        }
        catch (err) {
            res.status(500).send({
                message: 'Error! Cannot fetch foods',
                error: err
            })
        }
    },

    removeType: async (req, res) => {
        const { type } = req.body

        try {
            const arr = await db.collection('types').findOne({ _id: type })

            if (!arr) {
                res.status(400).send('No such type')
            }
            else {
                const foodIds = arr.foodList

                await Promise.all(foodIds.map(async foodId => {
                    await db.collection('foods').deleteOne({ _id: foodId })
                }))

                await db.collection('types').deleteOne({ _id: type })
                res.status(200).send({
                    message: 'Deleted Successfully'
                })

            }
        }
        catch (err) {
            res.status(500).send({
                message: 'Error! Cannot delete type',
                error: err
            })
        }
    },

    updateType: async (req, res) => {
        try {
            const { oldType, newType } = req.body;
            const arr = await db.collection('types').findOne({ _id: oldType })
            if (!arr) {
                res.status(400).send('No such type')
            }
            else {
                const foodIds = arr.foodList

                await db.collection('foods').updateMany({ type: oldType }, { $set: { type: newType } })
                await db.collection('types').insertOne({ _id: newType, foodList: foodIds })
                await db.collection('types').deleteOne({ _id: oldType })
                res.status(200).send({
                    message: 'OK'
                })
            }
        }
        catch (err) {
            res.status(500).send({
                message: 'Server error',
                error: err
            })
        }

    }
}
export default adminController