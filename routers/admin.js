import express, { Router } from 'express'
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import db from '../config.js'
import adminController from '../controller/admin.js';

const adminRouter = express.Router()

adminRouter.post('/add-item', adminController.addFood)
adminRouter.post('/remove-item', adminController.removeFood)
adminRouter.post('/update-item', adminController.updateFood)
adminRouter.post('/remove-type', adminController.removeType)
adminRouter.get('/get-all-foods', adminController.getAllFoods)
adminRouter.get('/get-all-foods', adminController.getAllFoods)
adminRouter.post('/update-type', adminController.updateType)

export default adminRouter