
import { ObjectId } from "mongodb";
import { mongoose, Schema } from "mongoose";
import db from '../config.js'


const adminController = {

    addFood: async (req, res) => {
        const { name, price, description, type, veg, img_url } = req.body
        const foodItem = req.body
        try {

            //const newfood = new Food({ name: name, })
            const foodDoc = await db.collection('foods').insertOne({ name: name, description: description, price: price, type: type, veg: veg, image: img_url });
            const typeDoc = await db.collection('types').findOne({ _id: type })
            if (typeDoc) {
                console.log(typeDoc)
                await db.collection('types').updateOne({ _id: type }, { $push: { foodList: ObjectId(foodDoc.insertedId) } })

            }
            else {
                await db.collection('types').insertOne({ _id: type, foodList: [foodDoc.insertedId] })
            }
            res.send("OK")

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

        const foodId = ObjectId(req.body.referenceId);

        const foodDoc = await db.collection('foods').findOne({ _id: foodId })
        try {
            const foodType = foodDoc.type

            await db.collection('foods').deleteOne({ _id: foodId }, (err, res) => { console.log(res) })
            await db.collection('types').updateOne({ _id: foodType }, { $pull: { foodList: foodId } })
            res.send("OK")

        }

        catch (err) {
            console.log(err);
            res.send(err)
        }
    },
    updateFood: async (req, res) => {
        const { refId, name, price, description, veg, img_url } = req.body;
        const foodId = ObjectId(refId);

        const ans = await db.collection('foods').updateOne({ _id: foodId }, { $set: { name: name, price: price, description: description, veg: veg, image: img_url } })
        res.send(ans)
    }
}
export default adminController