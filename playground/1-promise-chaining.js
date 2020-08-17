require("../src/db/mongoose.js");

const User = require("../src/models/user.js");

// User.findByIdAndUpdate("5f34198e1a185d4ab02660a0", { age: 2 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 2 });
//   })
//   .then((result) => {
//     console.log(result);
//   });


const updateAgeAndCount =async(id,age)=>{
  const user = await User.findByIdAndUpdate(id,{age})
  const count = await User.countDocuments({age})
  return count
}

updateAgeAndCount('5f33f53fd31606f7cd1520ab',33).then((result)=>{
  console.log('result',result)
}).catch((e)=>{
  console.log('error',e)
})