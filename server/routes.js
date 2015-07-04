// app/routes.js
var fs = require('fs');

module.exports = function(app, passport) {


    app.get('/',
      function(req, res) { 
        isLoggedIn(req, res, function(){
            res.render('index.ejs', {user: req.user});
        });
    });


    app.get('/plugins.json', function(req, res) { 
        var pluginsRaw = fs.readFileSync('plugins/plugins.json');
        res.write(pluginsRaw);
        res.send();
    });


    app.get('/api/users/me',
      passport.authorize('local-login', { session: false,  failureRedirect: '/login' }),
      function(req, res) { 
        res.json({ id: req.user.id, username: req.user.username });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        if(req.isAuthenticated()){
            res.redirect('./');
        }
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : './#/home', // redirect to the secure profile section
        failureRedirect : './login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/register', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('register.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/register', passport.authenticate('local-register', {
        successRedirect : './login', // redirect to the secure profile section
        failureRedirect : './register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     res.render('profile.ejs', {
    //         user : req.user // get the user out of session and pass to template
    //     });
    // });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('./login');
    });

    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('./login');
}