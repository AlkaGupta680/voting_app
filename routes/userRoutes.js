const express=require('express') ;
const router = express.Router();
const user = require('./../models/users');
const {jwtMiddleware,generateToken}= require('./../jwt');


// POST METHOD route to add user
router.post('/signup' , async(req,res)=>{
    try {
     const data = req.body ;
       //create a new user document using mongoose model 
     const newUser = new user(data) ;
     //save new user to database 
     const response = await newUser.save() ;
     console.log("data saved") ; 
       //payload 
       const payload = {
        id:response.id ,
        // username: response.username for security purpose ( as it is aadhar card number)
       }
       console.log(JSON.stringify(payload)) ;
       const token = generateToken(payload) ;
       console.log('Token saved is : ' , token)
     res.status(201).json({response:response , token : token}) ;
    } 
    catch (err) {
      console.log(err) ;
      res.status(500).json({error:'internal server error'}) ;
    }
 })


//login route 
router.post('/login' ,async(req,res)=>{
  try {
    //extract Aadhar card number and password from request body
    const{aadharCardNumber,password} = req.body ; 
    //find user by Aadhar card
    const user = await user.findOne({aadharCardNumber:aadharCardNumber}) ;
    //if user do not exit or password is incorrect 
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'})
    }
    //generate token 
    const payload ={
      id:user.id ,
      username:user.username 
    }
    const token = generateToken(payload)
    //return token as response 
    res.json({token})
  } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal serval error'})
  }
}) ; 

//profile route 
router.get('/profile',jwtMiddleware , async(req,res)=>{
   try {
     const userData = req.user ;   //using token
     console.log("user data :" , userData) 
     const userId = userData.id ;
     const  user =  await user.findById(userId) ;

     res.status(200).json({user}) ;

   } catch (err) {
    console.log(err) ;
    res.status(500).json({error:'internal serval error'})
   }
})
 

//update or change password
router.put('/profile/password',jwtMiddleware , async(req,res)=>{
  try {
    const userId = req.user.id ;//extract the id from  token
    const {currentPassword,newPassword} = req.body  // Extract current and new password from request body 

    //find user by userID 
    const user= await user.findById(userId)
    //if password is incorrect 
    if( !(await user.comparePassword(currentPassword))){
      return res.status(401).json({error:'Invalid username or password'})
    }
   // update  user's password 
     user.password = newPassword ;
     await user.save() ;
    console.log(" password updated")
      res.status(200).json({message:"password updated"}) ;

  } catch (err) {
    console.log(err) ;
      res.status(500).json({error:"internal server error"})
  }
})




//module export  this is very imp step 
  module.exports = router ;
