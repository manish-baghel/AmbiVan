var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = require('./ApplicationInstance');
var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./backend/Models/database.js');
var compression = require('compression');
var _ = require("underscore");
var mainRoutes = require('./backend/routes/MainRoutes');

//configuration ===============================================

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./backend/Models/passport')(passport); // pass passport for configuration



app.use(logger('dev'));
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'client')));
//app.use('/courses', express.static(path.resolve(__dirname, 'client')));
app.set('port', process.env.PORT || 4000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


// required for passport
app.use(session({ secret: 'letthegamebegins' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/auth',function(req,res){
        res.render('auth.ejs')
    })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/admin',requireRole('admin'),function(req,res){
        res.render('admin.ejs');
    });
    app.get('/member',requireRole('member'),function(req,res){
        res.render('member.ejs');
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            // console.log(res);
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login',function(req,res,next){
            passport.authenticate('local-login',function(err ,user,info){
          /*  if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
            if (err) { return next(err); }
            // Redirect if it succeeds
            return res.redirect('/' + user.username);*/
            if (err)
                    return next(err);
                // if no user is found, return the message
                if (!user)
                    return res.redirect('/login');//done(null, false, req.flash('loginMessage', 'No user found.'));

             /*   if (!user.validPassword(password))
                    return res.redirect('/login');//done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
*/
                // all is well, return user
                req.logIn(user, function(err) {
                if (err) { return next(err); }
                // Redirect if it succeeds
                return res.redirect('/' + user.local.role);
                });
                /*else
                {
                    return res.redirect('/'+user.local.role);//done(null, user);
                }
        */
        })(req, res, next);
    });

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
     (function(){
        if(true)
        return     });;
 })

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/admin', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/admin', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function requireRole (role) {
    return function (req, res, next) {
       // var str = JSON.stringify(req.user);
//       var str = JSON.stringify(req.user.local.role, null, 4)

  //      console.log(str);
        
        if(typeof req.user != "undefined")
        { 
            if ( req.user.local.role === role) {
              //res.send(403);
                //res.redirect('/login');
                next();
            } else {
                //next();
                res.send(403);
            }
        }else
        {
            res.redirect('/login');
        }
    }
}








app.use('/', mainRoutes);
app.listen(app.get('port'), function () {
    console.log('Application running in port '+ app.get('port'));
});