import mongoose from "mongoose";
const {Schema,model}= mongoose

const productSchema=new Schema({
    name:{type:String, required: true},
    price:{type:Number,required:true},
    thumbnail:{type:String,required:true},
})

const Producto = model("producto",productSchema);
export default Producto
