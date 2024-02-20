const { default: mongoose } = require('mongoose');
const { Router } = require("express");
const { Account, User } = require('../db/db.js');
const { authMiddleware } = require('../middleware/user');

const accountRouter = Router();

accountRouter.get("/balance",authMiddleware, async(req,res)=>{
    const account = await Account.findOne({userId: req.userId});
    try{
        res.json({
            balance: account.balance
        })
    } catch(err){
        res.status(500)
        res.json({
            error: err.message
        })
    }
    
})

accountRouter.post("/transfer",authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const account = await Account.findOne({userId: req.userId}).session(session);
    if(!account || account.balance<req.body.amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    const toAccount = await Account.findOne({userId: req.body.to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "invalid account"
        });
    }
    // Update sender's balance
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc:{
            balance: -req.body.amount
        }
    }).session(session)
    
    // Update receiver's balance
    await Account.updateOne({
        userId: req.body.to
    }, {
        $inc:{
            balance: req.body.amount
        }
    }).session(session)

    const sender = await User.findOne({_id: req.userId}).session(session);
    console.log("sender = ",sender)
    const senderName = sender.firstName + " " + sender.lastName;
    const receiver = await User.findOne({_id: req.body.to}).session(session);
    const receiverName = receiver.firstName + " " + receiver.lastName;

    // Update sender's ledger
    await Account.updateOne({
        userId: req.userId,
    },{
        $push: {
            ledger:{
                amount: -req.body.amount,
                toUserId: req.body.to ,
                toUserFullName: receiverName
            }
        }
    }).session(session)

    // Update receiver's ledger
    await Account.updateOne({
        userId: req.body.to
    },{
        $push: {
            ledger: {
                amount: req.body.amount,
                fromUserId: req.userId,
                fromUserFullName: senderName
            }
        }
    }).session(session)
    
    await session.commitTransaction();

    return res.json({
        message: "Transfer successful"
    })
})

module.exports=accountRouter;
