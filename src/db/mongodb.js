const mongodb = require("mongodb");
const MonogoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionUrl = "mongodb://127.0.0.1:27017";
const database = "task-manager";
MonogoClient.connect(
  connectionUrl,
  { useUnifiedTopology: true, useUnifiedTopology: true },
  (error, client) => {
    //database
    if (error) {
      console.log("cannot connect to db");
    }

    const db = client.db(database);
    //   db.collection("users").insertOne({
    //     name: "Vishal Chowdhry",
    //     age: 32,
    //   });
    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "This is it",
    //       completed: true,
    //     },
    //     {
    //       description: "This is second",
    //       completed: false,
    //     },
    //     {
    //       description: "This is third",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log("cannot insert the documents");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5f33b41189e86e7a02c680b0") },
    //   (error, task) => {
    //     if (error) console.log("cant find");

    //     console.log(task);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ completed: true })
    //   .toArray((error, tasks) => {
    //     console.log(tasks);
    //   });

    db.collection("tasks")
      .updateMany(
        { completed: true },
        {
          $set: {
            completed: false,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
