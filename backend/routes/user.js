const jwt = require('jsonwebtoken');
const { Router } = require("express");

const z = require('zod');
const JWT_SECRET = require('../config')

const { User, Account } = require('../db/db.js');
const { authMiddleware } = require('../middleware/user');

const userRouter = Router();

const signupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
})

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})

const updateUserSchema = z.object({
    password: z.string().min(6).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})


userRouter.post("/signup", async(req,res)=>{
    if(signupSchema.safeParse(req.body).error){
        return res.status(411).json({message: "Incorrect inputs"})
    }
    const user = await User.findOne({
        username: req.body.username
    });
    if(user){
        return res.status(411).json({message: "Email already taken" })
    }
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }) 
    await newUser.save();
    const newAccount = new Account({
        userId: newUser._id,
        balance: 1+ 10000*Math.random(),
        fullName:  req.body.firstName + " " +  req.body.lastName
    })
    await newAccount.save();
    const token = jwt.sign({
        userId: newUser._id
    }, JWT_SECRET);

    res.json({
        message: 'User added successfully',
        token: token
    })
})

userRouter.post("/signin",async (req,res)=>{
    if(signinSchema.safeParse(req.body).error){
        return res.status(411).json({message: "Incorrect inputs"})
    }
    const user = await User.findOne({
        username: req.body.username
    });
    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        return res.json({token: token, id: user._id})
    }
    // 
    res.status(403).json({
        message: "User does not exist"
    })
})

userRouter.put("/",authMiddleware, async (req,res)=>{
    if(updateUserSchema.safeParse(req.body).error){
        return res.status(411).json({message: "Error while updating information"})
    }
    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

userRouter.get("/",authMiddleware, async (req,res)=>{
    const user = await User.findOne({
        _id: req.userId
    })

    res.json({
        email: user.username,
        firstname: user.firstName,
        lastName: user.lastName,
        id: req.userId
    })
})

userRouter.get("/bulk",authMiddleware, async (req,res)=>{
    const filter = req.query.filter || "";
    // find all users except self
    let users = await User.find({
        $and: [{
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        }, {
            _id: {
                $ne: req.userId
            }
        }]
    });
    
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=userRouter;