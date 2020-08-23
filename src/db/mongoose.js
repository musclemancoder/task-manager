const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


// myself
//   .save()
//   .then(() => {
//     console.log(myself);
//   })
//   .catch((error) => {
//     console.log("Error!!!!!!!!!!!", error);
//   });

// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });

// mytask = new Task({
//   description: "This is the first task          ",
//   completed: true,
// });

// mytask
//   .save()
//   .then(() => {
//     console.log(mytask);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
