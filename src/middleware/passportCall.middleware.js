const passport = require('passport')

const passportCall = (strategy)=>{
    return(req,res,next)=>{
        passport.authenticate(strategy,(err,user,info)=>{
            if(err) return next(err)
            if(!user) return res.send({status:'error',error: info.message ? info.message : info.toString()})
            req.user = user
            next()
        })(req,res,next)
    }
}

module.exports = {
    passportCall
}