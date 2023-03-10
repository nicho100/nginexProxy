import mongoose from "mongoose";
const {Schema,model}= mongoose

const chatSchema=new Schema({
    email:{type:String, required: true},
    message:{type:String,required:true},
})

const Chat = model("chat",chatSchema);
export default Chat
