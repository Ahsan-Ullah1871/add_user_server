const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(bodyParser.json());
app.use(cors());
require("dotenv").config();

const port = 4000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pm4wm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const AddUserCollection = client.db("TestDB").collection("AddUser");
	console.log("database Connected");
	app.post("/addUser", (req, res) => {
		const user = req.body;
		AddUserCollection.find({ email: user.email }).toArray(
			(err, documents) => {
				console.log(documents);
				if (documents.length > 0) {
					console.log("ache");
					res.send("Ache");
				} else {
					AddUserCollection.insertOne(user).then(
						(result) => {
							res.send("Added");
						}
					);
				}
			}
		);
	});
	app.get("/getUser", (req, res) => {
		AddUserCollection.find({}).toArray((arr, documents) => {
			res.send(documents);
		});
	});
	app.delete("/deleteUser/:id", (req, res) => {
		AddUserCollection.deleteOne({
			_id: ObjectId(req.params.id),
		}).then((result) => {
			res.send(result.deletedCount > 0);
		});
	});
});

app.listen(process.env.PORT || port);
