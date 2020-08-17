require("../src/db/mongoose.js");

const Task = require("../src/models/task.js");

// Task.findByIdAndDelete("5f3400956e4a851b8cfb56b9").then((user) => {
//     console.log(user);
//     return Task.countDocuments({ completed: false });
//   }).then((result) => {
//     console.log("count", result);
//   });


deleteTaskAndCount = async(id,completed)=>{
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed})
  return count
}

deleteTaskAndCount('5f38c88e6321f2c18ddfd019',false).then((result)=>{
  console.log(result)
}).catch((e)=>{
  console.log(e)
})