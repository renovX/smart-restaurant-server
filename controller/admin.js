import { ObjectId } from "mongodb"
import db from '../config.js'


const adminController = {

    addFood: async (req, res) => {

        const { name, price, description, type, veg, imgUrl } = req.body

        const foodItem = req.body
        try {

            //const newfood = new Food({ name: name, })

            const foodDoc = await db.collection('foods').insertOne({ name: name, description: description, price: price, type: type, veg: veg, image: imgUrl })

            const typeDoc = await db.collection('types').findOne({ _id: type })
            if (typeDoc) {
                await db.collection('types').updateOne({ _id: type }, { $push: { foodList: ObjectId(foodDoc.insertedId) } })

            }
            else {
                await db.collection('types').insertOne({ _id: type, foodList: [foodDoc.insertedId] })
            }
            res.status(200).send("OK")

        }
        catch (e) {
            console.log(e)
            res.status(500).send({
                message: 'Success',
                error: e
            })
        }

    },
    removeFood: async (req, res) => {

        const foodId = ObjectId(req.body.referenceId);

        const foodDoc = await db.collection('foods').findOne({ _id: foodId })
        try {
            const foodType = foodDoc.type

            await db.collection('foods').deleteOne({ _id: foodId }, (err, res) => { console.log(res) })
            await db.collection('types').updateOne({ _id: foodType }, { $pull: { foodList: foodId } })
            res.status(200).send("OK")

        }

        catch (err) {
            console.log(err);
            res.status(500).send(err)
        }
    },
    updateFood: async (req, res) => {

        try {
            const { refId, name, price, description, veg, imgUrl } = req.body;
            const foodId = ObjectId(refId);

            const ans = await db.collection('foods').updateOne({ _id: foodId }, { $set: { name: name, price: price, description: description, veg: veg, image: imgUrl } })
            res.status(200).send(ans)
        }
        catch (e) {
            res.status(500).send('Server error')
        }

    },

    getAllFoods: async (req, res) => {
        try {
            const foodsCollection = await db.collection('foods')

            if (!foodsCollection) {
                res.status(404).send('Request error, please check the request parameters')
            }
            else {
                const foodArray = await foodsCollection.find({}).toArray()

                const foods = {}

                foodArray.forEach(food => {
                    const currentType = food.type
                    if (foods[currentType]) {
                        foods[currentType].push(food)
                    }
                    else {
                        foods[currentType] = [food]
                    }
                })

                res.send(foods)
            }
        }
        catch (e) {
            res.status(500).send('Error! Cannot fetch foods')
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
                res.status(200).send('Deleted Successfully')

            }
        }
        catch (e) {
            res.status(500).send('Error! Cannot delete type')
        }

    }
}
export default adminController