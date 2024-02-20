const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://raghavgpt001:Pneumono%40001424@cluster0.bvgjvfu.mongodb.net/test?retryWrites=true&w=majority');
mongoose.connect('mongodb+srv://raghavgpt001:Pneumono%40001424@cluster0.bvgjvfu.mongodb.net/test');
// mongoose.connect("mongodb://atlas-sql-657d45fc3f47411eba071be7-d73po.a.query.mongodb.net/paytm?ssl=true&authSource=admin");
// mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    ledger: [{
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        toUserFullName: {
            type: String,
            // required: true
        },
        fromUserFullName: {
            type: String,
            // required: true
        }
    }]
});
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account',accountSchema)

module.exports= {
    User,
    Account
};