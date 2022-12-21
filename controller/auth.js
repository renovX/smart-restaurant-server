import { ObjectId } from "mongodb"
import db from '../config.js'
const authController =
{
    signUp: async (req, res, next) => {
        try {
            const { user_id, passwd } = req.body;
            const adminDoc = await db.collection('admin').insertOne({ user_id, passwd })
            res.status(200).send({
                id: adminDoc.insertedId,
                message: 'OK'
            })
        }
        catch (e) {
            res.status(500).send({
                message: 'Error',
                error: e
            })
        }

    },
    signIn: async (req, res, next) => {
        try {
            const { user_id, passwd } = req.body;

            const adminDoc = await db.collection('admin').findOne({ user_id: user_id })
            if (adminDoc) {
                if (adminDoc.passwd == passwd) res.status(200).send("Correct Password")
                else res.status(401).send("Incorrect Password")
            }
            else
                res.status(401).send("Invalid UserId")
        }
        catch (e) {
            res.status(500).send({
                message: 'Error',
                error: e
            })
        }

    },
    //signOut:
    
}
export default authController