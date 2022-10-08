const mongooes = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongooes.Schema({
    firstname: {
        type: String,
        required: true,
        uppercase: true,
        min: 2,
        max: 25
    },
    lastname: {
        type: String,
        required: true,
        uppercase: true,
        min: 2,
        max: 25
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        uppercase: true

    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generating a token
employeeSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        // console.log(token);
        return token;
    } catch (error) {
        res.send("the token error part" + error);
        // console.log("the token error part" + error);
    }
}


//consverting password in Hash
employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})
//now we need to create a collection

const Register = new mongooes.model("Register", employeeSchema);
module.exports = Register;