const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{
   //first check  request  headers has authorization or not 
   const authorization = req.headers.authorization
   if(!authorization) return res.status(401).json({error:'Token not find'})

    //extract jwt  token from the request header
  const token = req.headers.authorization.split(' ')[1] ;
  if(!token) return res.status(401).json({error:'Unauthorized Access'})
    try {
        //verify token 
        const decoded = jwt.verify(token,process.env.JWT_SECRET) ;
        //Attach user information to the request object 
        // req.jwtPayload = decoded ; 
        req.user = decoded ; 
        next() ;
    } catch (err) {
        console.error(err) ;
        res.status(401).json({error:'Invalid token'})
    }
}
   //function to generate token 
   const generateToken = (userData)=>{
    //generate  a new jwt token using user Data
    return jwt.sign(userData , process.env.JWT_SECRET , { expiresIn:30000 })  ;
   }

   //export 
 module.exports = {jwtMiddleware,generateToken} ;
