import express, { Router } from 'express'
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import db from '../config.js'
import dinerController from '../controller/diner.js';

const dinerRouter = express.Router()

dinerRouter.get('/get-types', dinerController.getMenuItemTypes)
dinerRouter.get('/get-foods/:type', dinerController.getFoods)
dinerRouter.post('/place-order', dinerController.placeOrder)

export default dinerRouter