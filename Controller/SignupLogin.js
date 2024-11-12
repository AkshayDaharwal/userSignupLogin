const User = require('../Model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')



exports.signup = async(req, res) =>{
    try {
        
        const {email, password} = req.body;

        if(!email || !password ){
            return res.status(400).json({ message : "email and password are required"})
        }
        const existUser = await User.findOne({ email});
        if(existUser){
            return res.status(404).json({message:"User already exist"})
        }
        // hash password
        // const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({ 
            email, 
            password }) // hashedPassword

        await user.save()

        res.status(200).json({ message: "user registered successfully"})

    } catch (error) {
        res.status(500).json({ message : "Server error", error})
    }
}

exports.login = async (req, res)=>{

    try {

        const {email , password} = req.body;

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ message : "user not found"})
        }
        
        //password
        const passwordMatched =  bcrypt.compare(password, user.password)
        if(!passwordMatched){
            return res.status(400).json({ message: "Wrong Password"})
        }

        //jwt token
        const token = jwt.sign({ userId: user.id}, 'secretKey', { expiresIn: '1h'})

        res.json({ token , message: "Login successfully"})

    } catch (error) {
        res.status(500).json({ message : "Server error in login", error})
    }
}

const transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth:{
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD,
    }
})

exports.resetPasswordLink = async(req, res) =>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message : "user not found"})
        }

         //resetToken  with 5mint
         const resetToken = jwt.sign({ userId: user.id}, 'secretKey', { expiresIn: '5m'})

         //reset password url
         const reset_URL = `http://localhost:3000/reset-password/${resetToken}` ;

        const mail = {
            from : process.env.EMAIL,
            to : user.email,
            subject : 'Reset Password',
            text : `click the link to reset your password , link vailed to 5mint $(reset_URL)`
        }
        await transporter.sendMail(mail)

        return res.status(200).json({ message : 'reset password link send to Email Id'})

    } catch (error) {
        res.status(500).json({ message : "error sending password link", error})
        
    }
}


exports.forgetPassword = async (req, res) =>{
    try {
        // const { newPassword} = req.body;
        const {token} = req.params;

        //token verify
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const userId = decoded.userId

        //update password
        await User.findByIdAndUpdate(userId, {password})

        res.status(200).json({message : 'forget password is successfully'})

    } catch (error) {
        res.status(500).json({ message : "error forget password", error})
    }
}