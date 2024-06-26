const User = require('./../models/user');

exports.getAllUsers = async (req, res) => {
    try{
        console.log("new request to create user");
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            result: users.length,
            data:{
                users
            }
        })
    }catch(err){
        res.status(408).json({
            status: 'testing fail!!!',
            message: 'testing',
        })
    }
}

exports.createUser = async (req, res) => {
      try {
        console.log("new request to create user");
        console.log(req);
        const newUser = await User.create(req.body);
        console.log("step1");
    
        res.status(201).json({
            status: 'success',
            data:{
                user: newUser
            }
        });
       }catch(err){
        console.log("step2");
        res.status(400).json({
            status: 'fail',
            message: err,
        })
       }
};
    