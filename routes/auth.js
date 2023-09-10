const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const User = require('../Models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchdata = require('../middleware/fetchdata')
const dotenv=require('dotenv').config()

const jwt_secret = process.env.JWTSECRET;
//Router-1 TO CREATE THE USER DETAILS
router.post('/create',  
    [body("name").isLength({ min: 3 }),
    body("email", 'enter a valid mail').isEmail(),
    body("password").isLength({ min: 5 })
    ], async (req, res) => {
        let success=false
        const error = validationResult(req);
        if (!error.isEmpty()) {

            return res.status(401).json({success, "errors": error.array() });
        }

        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(req.body.password, salt);
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(401).json({success, error: "The email is already registered" })
        }
        success=true
        user = await User.create({
            
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        const data = {
            user: {
                id: user._id,
            }
        }
        var authtoken = jwt.sign(data, jwt_secret);

        res.json({success, authtoken })
    })

//Router-2 login verification 
router.post('/login', [
    body('email').isEmail(),
    body('password')
], async (req, res) => {
    let success=false;
    const { email, password } = req.body;
    let user = await User.findOne({ email })
    if (!user) {
        success=false
        return res.status(401).send({success, error: "Enter valid login credentials!" })
    }
    const passwordcompare = await bcrypt.compare(password, user.password)
    if (!passwordcompare) {
        success=false
        return res.status(401).send({ success,error: "Enter valid login credentials!" })
    }
    const data = {
        userId: user.id
    }
    console.log(data)
    var authtoken = jwt.sign(data, jwt_secret)
    success=true
    res.json({success, authtoken })
})
// Router-3 Fetch user details

router.get('/userdetails', fetchdata, async (req, res) => {

    let userid = req.userid;
    console.log(userid)
    const user = await User.findById(userid ).select('-password')
    res.send(user)
})

module.exports = router