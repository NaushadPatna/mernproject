require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


require("../src/db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})

//Create a new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })


            const token = await registerEmployee.generateAuthToken();

            const registered = await registerEmployee.save();
            res.status(201).render("index");

        } else {
            res.send("password missmatch");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

//login validation or check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, userEmail.password);

        const token = await userEmail.generateAuthToken();
        console.log("the token parrt" + token);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid password details.");
        }

    } catch (error) {
        res.status(400).send("Invalid email details");
    }
})

// const createToken = async () => {
//     const token = await jwt.sign({ _id: "63411095406a1bf4c120eb48" }, "mynameismdnaushadalamnodejscodder", {
//         expiresIn: "2 second"
//     });
//     console.log(token);

//     const userVeri = await jwt.verify(token, "mynameismdnaushadalamnodejscodder");
//     console.log(userVeri);
// }

// createToken();

app.listen(port, () => {
    console.log(`Server is running at port no. ${port}`);
})