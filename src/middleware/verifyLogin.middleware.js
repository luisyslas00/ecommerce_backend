function checkNotAuthenticated(req, res, next) {
    if(req.cookies["token"]||req.session.user){
        return res.redirect('/')
    }
    next();
}

module.exports = {
    checkNotAuthenticated
}