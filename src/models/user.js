const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("provide valid email");
            }
        },
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
        validater(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"');
            }
        },
    },
})

//Generation token

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisignature')

    console.log(token)
    return token

}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login!!")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login!!")
    }
    console.log('testx', user);
    return user
}


//Hash the plain text password before saving
userSchema.pre('save', async function(next) {

    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})
const User = mongoose.model("User", userSchema);

module.exports = User;