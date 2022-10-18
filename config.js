import { mongoose } from "mongoose";
await mongoose.connect("mongodb+srv://pdfb:pdfbGAMERS@cluster0.grnv8hv.mongodb.net/smart_restaurant")
const db = mongoose.connection
export default db;