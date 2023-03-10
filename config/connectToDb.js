import mongoose from "mongoose";
import { urlMongo } from "./enviorment";
let isConnected;
const connectToDb=async()=>{
    if(!isConnected){
        console.log("se conecto")
        await mongoose.connect(urlMongo);
        isConnected=true
        return
    }
    console.log("esta conectado")
    return
}

export {connectToDb}