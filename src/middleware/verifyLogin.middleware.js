function checkNotAuthenticated(req, res, next) {
    console.log(req.isAuthenticated())
    if(req.cookies["token"]||req.session.user){
        return res.redirect('/')
    }
    next();
}

module.exports = {
    checkNotAuthenticated
}