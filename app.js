var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
// var https = require('https');
var http = require('http');
var options = {
  key: fs.readFileSync('cert/private.pem'),
  cert: fs.readFileSync('cert/ac0b1178d0ba394.crt')
};
var port = process.env.PORT || process.env.VCAP_APP_PORT || 443;
var app = require('./ApplicationInstance');
// var passport = require('passport');
// var mongoose = require('mongoose');
// var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./backend/Models/database.js');
var compression = require('compression');
var _ = require("underscore");
var mainRoutes = require('./backend/routes/MainRoutes');
var firebase = require('firebase');

//configuration of firebase ===============================================
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyCwjE3C7n5IsENcCUzpTHeKWgf8j7jpFQY",
  authDomain: "ambivandriver.firebaseapp.com",
  databaseURL: "https://ambivandriver.firebaseio.com",
  projectId: "ambivandriver",
  storageBucket: "ambivandriver.appspot.com",
  messagingSenderId: "822725110617"
};
firebase.initializeApp(config);

var database = firebase.database();
(function writeUserData() {
  firebase.database().ref().child("driver3").set({
    username: "name"
    // email: "email",
    // profile_picture : "imageUrl"
  });
  console.log("hi"+" "+database.ref());
  var currentdate = new Date();
  console.log(currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() + " @ "   + currentdate.getHours() + ":"   + currentdate.getMinutes() + ":"  + currentdate.getSeconds());
})();

(function readuserdata() {
    firebase.database().ref('/driver2').once('value').then(function(snapshot){
        var user = (snapshot.val() );
        console.log(user['profile_picture']);
    })
})();
// // configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database

// require('./backend/Models/passport')(passport); // pass passport for configuration



app.use(logger('dev'));
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'client')));
//app.use('/courses', express.static(path.resolve(__dirname, 'client')));
app.set('port', /*process.env.PORT || 4000*/port);//pass port instead of explicitly declaring
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


// // required for passport
// app.use(session({ secret: 'letthegamebegins' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session




// // normal routes ===============================================================




//     // PROFILE SECTION =========================
//     app.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile.ejs', {
//             user : req.user
//         });
//     });

//     app.get('/admin',requireRole('admin'),function(req,res){
//         res.render('admin.ejs');
//     });
//     app.get('/member',requireRole('member'),function(req,res){
//         res.render('member.ejs');
//     });

//     // LOGOUT ==============================
//     app.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });
// /*
//     app.post('/',function(req,res,next){
//         console.log(req.body);
//     });
// */

// // =============================================================================
// // AUTHENTICATE (FIRST LOGIN) ==================================================
// // =============================================================================

//     // locally --------------------------------
//         // LOGIN ===============================
//         // show the login form
//         app.get('/login', function(req, res) {
//             // console.log(res);
//             res.render('login.ejs', { message: req.flash('loginMessage') });
//         });

//         // process the login form
//         app.post('/login',passport.authenticate('local-login', {
//             successRedirect : (function(req,res){
//                 console.log(req);
//                 console.log(res);
//                 console.log("hiihi");
//                 if(true){
//                     console.log(res);
//                     return 'admin';
//                 }

//                 else
//                     return 'member';
//                 }()), // redirect to the secure profile section
//             failureRedirect : '/login', // redirect back to the login page if there is an error
//             failureFlash : true // allow flash messages
//         }));

//         app.post('/login',function(req,res,next){
//             passport.authenticate('local-login',function(err ,user,info){
//           /*  if (err) { return next(err); }
//             // Redirect if it fails
//             if (!user) { return res.redirect('/login'); }
//             req.logIn(user, function(err) {
//             if (err) { return next(err); }
//             // Redirect if it succeeds
//             return res.redirect('/' + user.username);*/
//             if (err)
//                     return next(err);
//                 // if no user is found, return the message
//                 if (!user)
//                     return res.redirect('/login');//done(null, false, req.flash('loginMessage', 'No user found.'));

//              /*   if (!user.validPassword(password))
//                     return res.redirect('/login');//done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
// */
//                 // all is well, return user
//                 req.logIn(user, function(err) {
//                 if (err) { return next(err); }
//                 // Redirect if it succeeds
//                 return res.redirect('/' + user.local.role);
//                 });
//                 /*else
//                 {
//                     return res.redirect('/'+user.local.role);//done(null, user);
//                 }
//         */
//         })(req, res, next);
//     });

//         // SIGNUP =================================
//         // show the signup form
//         app.get('/signup', function(req, res) {
//             res.render('signup.ejs', { message: req.flash('signupMessage') });
//      (function(){
//         if(true)
//         return     });;
//  })

//         // process the signup form
//         app.post('/signup', passport.authenticate('local-signup', {
//             successRedirect : '/admin', // redirect to the secure profile section
//             failureRedirect : '/signup', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }));


// // =============================================================================
// // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// // =============================================================================

//     // locally --------------------------------
//         app.get('/connect/local', function(req, res) {
//             res.render('connect-local.ejs', { message: req.flash('loginMessage') });
//         });
//         app.post('/connect/local', passport.authenticate('local-signup', {
//             successRedirect : '/admin', // redirect to the secure profile section
//             failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }));


// // =============================================================================
// // UNLINK ACCOUNTS =============================================================
// // =============================================================================
// // used to unlink accounts. for social accounts, just remove the token
// // for local account, remove email and password
// // user account will stay active in case they want to reconnect in the future

//     // local -----------------------------------
//     app.get('/unlink/local', isLoggedIn, function(req, res) {
//         var user            = req.user;
//         user.local.email    = undefined;
//         user.local.password = undefined;
//         user.save(function(err) {
//             res.redirect('/profile');
//         });
//     });


// // route middleware to ensure user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();

//     res.redirect('/');
// }

// function requireRole (role) {
//     return function (req, res, next) {
//        // var str = JSON.stringify(req.user);
// //       var str = JSON.stringify(req.user.local.role, null, 4)

//   //      console.log(str);

//         if(typeof req.user != "undefined")
//         {
//             if ( req.user.local.role === role) {
//               //res.send(403);
//                 //res.redirect('/login');
//                 next();
//             } else {
//                 //next();
//                 res.send(403);
//             }
//         }else
//         {
//             res.redirect('/login');
//         }
//     }
// }







app.use('/', mainRoutes);
// https.createServer(options, app).listen(port);
http.createServer(app).listen(port);
console.log('Application running in port '+ app.get('port'));
var currentdate = new Date();
console.log(currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() + " @ "   + currentdate.getHours() + ":"   + currentdate.getMinutes() + ":"  + currentdate.getSeconds());
// app.listen(app.get('port'), function () {
//     console.log('Application running in port '+ app.get('port'));
// });
