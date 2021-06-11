import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    message: String,
    name: String,
    uid: String
}, {timestamps: true} );

const chatSchema = mongoose.Schema({
    name: String,
    lastMessage: {type: messageSchema, default: {message: "", name:"", uid: ""}},
    messages: [messageSchema]
}, {timestamps: true});

export default mongoose.model("Chats", chatSchema);
const messages = mongoose.model("Messages", messageSchema);

export {messages};