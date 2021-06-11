import dotenv from "dotenv"
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import chats, {messages} from './model.js';
import Pusher from "pusher";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const URL = "mongodb+srv://admin-nero:nerotics@cluster0.yc637.mongodb.net/chatDB?retryWrites=true&w=majority";
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const pusher = new Pusher({
  appId: process.env.APPID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once("open", () => {
     console.log("Connection Opened");

     const collection = db.collection("chats");
     const changeStream = collection.watch();

     changeStream.on("change", change => {
         if (change.operationType === "insert") {
            const document = change.fullDocument;
            pusher.trigger("chat", "insertion", document);
         }
         else if (change.operationType === "update") {
             const document = change.updateDescription.updatedFields.lastMessage;
                pusher.trigger("chat", "updated", document)
         }
     });
});

app.get("/", (req, res) =>
{
    res.status(200).send("Whatsapp clone!!");
})

app.route('/api/v1/chat')
    .get((req, res) => {
        chats.find((err, result) => {
            if(err) {
                res.status(500).send(err);
            }
            else {
                res.status(200).json(result);
            }
        })
    })
    .post((req, res) => {
        const chat = new chats({
            name: req.body.name
        })

        chat.save(err => {
            if(err) {
                res.status(500).send(err);
                console.log(err);
            }
            else {
                res.status(200);
            }
        })
    })

    app.route("/api/v1/message/:id")
        .get((req, res) => {
            const id = req.params.id;
            chats.findById(id, (err, result) => {
                if(err)
                {
                    res.status(500).send(err);
                }
                else
                {
                    res.status(200).json(result);
                }
            })
        })
        .post((req, res) => {
            const id = req.params.id;

            const message = new messages({
                message: req.body.message,
                name: req.body.name,
                uid: req.body.uid
            })

            chats.findById(id, (err, result) => {
                if(err) {
                    res.status(500).send(err);
                    console.log(err);
                }
                else {
                    result.messages.push(message);
                    result.lastMessage = message;
                    result.save();
                    res.status(200).send("Working");
                }
            })
        })

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));