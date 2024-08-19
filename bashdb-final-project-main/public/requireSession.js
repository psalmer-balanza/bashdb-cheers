// this function is used for checking session in admin pages
function requireSessionAdmin(req, res, next) {
    // Check if the user is authenticated and has the 'Admin' role
    if (req.session.user && req.session.user.role === 'Admin') {
        next(); // User is authenticated as Admin proceed to next task
    } else {
        res.redirect('/login')
    }
}

// this function is used for checking session in content manager pages
function requireSessionContent(req, res, next) {
    // Check if the user is authenticated and has the 'Content Manager' role
    if (req.session.user && req.session.user.role === 'Content Manager') {
        next(); // User is authenticated as Content Manager proceed to next task
    } else {
        res.redirect('/login')
    }
}

// export the following method for the server_script.js to use
module.exports = {
    requireSessionAdmin,
    requireSessionContent,
};