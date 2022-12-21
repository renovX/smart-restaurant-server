import { async } from '@firebase/util'
import express from 'express'
import db from '../config.js'
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import authController from '../controller/auth.js';

const authRouter = express.Router()

authRouter.post('/signUp', authController.signUp)
authRouter.post('/signIn', authController.signIn)
authRouter.post('/credentials', async (req, res) => {
    const { phoneNumber } = req.body
    try {
        const db_collection = collection(db, 'usersdata', phoneNumber, 'orders')
        const addingReference = await addDoc(db_collection, {
            hi: [46, 456, 456, 456]
        })
        res.send({
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

export default authRouter