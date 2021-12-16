//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const port = process.env.PORT ||1000;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

mongoose.connect(process.env.DB_URL)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/register', (req, res) => {
    res.render("register");
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save();
        res.render("secrets");
    });
    
})

app.post('/login', (req, res) => {
    const email = req.body.username;
    const password = req.body.password

    User.findOne({ email: email}, (err, foundUser) => {
        if (err) {
            console.log(err);
        }else{
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result===true) {
                        res.render("secrets");
                    } else {
                        res.write("TRY AGAIN");
                        res.send();
                    }
            });

                
            }
        }
    })
})




app.listen(port, ()=> {
    console.log("Server listening on port " + port);
});
