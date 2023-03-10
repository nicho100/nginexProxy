import mongoose from "mongoose";
const {Schema,model}= mongoose

const chatSchema=new Schema({
    username:{type:String, required: true},
    password:{type:String,required:true},
})

const User = model("user",chatSchema);
export default User
