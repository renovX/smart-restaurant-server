import express, { Router } from 'express'
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import db from '../config.js'
import adminController from '../controller/admin.js';

const adminRouter = express.Router()

adminRouter.post('/add-item', adminController.addFood)
adminRouter.post('/delete-item', adminController.removeFood);
adminRouter.post('/update-item', adminController.updateFood)

export default adminRouter