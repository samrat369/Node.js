const express = require('express');
const session = require('express-session');
const passport = require('passport');

const SamlStrategy = require('passport-saml').Strategy;

const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"./views"));
app.use(express.static(path.join(__dirname,"./static")))

// Set up session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60*1000, // Session expiration time in milliseconds (1 min in this example)
  }
}));

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use((req, res, next) => {
  req.session.authorize = true;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Serialize user session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user session
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new SamlStrategy(
    {
      callbackUrl: "https://authorizationsamlaccessmanagementfoundat.onrender.com/callback",
      entryPoint: "https://dev-npofkt2fait2dmyy.us.auth0.com/samlp/w3mS9TGUc3huSRcViFeWEhbEYKcsusdE?connection=Username-Password-Authentication",
      issuer: "https://authorizationsamlaccessmanagementfoundat.onrender.com/callback",
      cert: "MIIDHTCCAgWgAwIBAgIJSi7z01cbQMBPMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjAxMDM1MDNaFw0zNjEwMjkxMDM1MDNaMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANlHohjY8jO9zuOOUvK0DNdxE8SOY68Di53JJqNHMg1+oDZoNVbMrEVBjaPqjNdS8Ld7UzRSAs+3DTjWjci0+NXqS+f9psb1LPovw1Fd1zqNw1p+Eh90mg7xYzvWKWlIrWlQIGtAKgCJhQp8tLMy6oxn4RYvFY7v2TBwOEeNpx/IXttwIzxUExeKHKwPfz9iihI10usVYVLaGnA6D+PhMFuxV/ZjhQ1I+MxjRV0TxkLLgSUqXA2czJInq3TPaZoCQSxkpCIMpPi6jR0HrN0+tWrkVdZM4gl3vXQrcopCq2jxjHQMpTUPE6cEJo++4xFMZbRXYLv7BcDUXR9BIMg7YeUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU4ZHsqBmjEWoXjbMwxi5faEmIAGIwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCCZX80lxRXdWkp2aEMj/IFsPvkI+m7RMj5OYfy8+aIQFUvHVSuok/9Dd9DedyFaszLZ4jNAJpVz8cjfZn7fkrNFd3dPEDwfQbmB7mN4SdsRXJWffy7coMUgVk38x3G7HlHlzKp18KES1UvyHZygzUEJTZR/wtUWURtEti/QdjJrq9XANwQhGAbD+3aYg0o36OaPyU1JbRCD6WUO8klnLcsg6EK4gLBaIc5B2Uaq3Vr3QaoDTKO8k0Z5lBvkagR/4BpNkcnAyPD/gjdhtOZ+KNfldi4xxoRNCI1yqFW3oszCQM/poOYuNyZGbV/gaQjQOdX4hBjGJ09mh+Cw3pYqw8u",
      acceptedClockSkewMs : -1,
      logoutUrl: "https://authorizationsamlaccessmanagementfoundat.onrender.com/logout",
      
    },
    function (profile, done) {
      // for signon
    
      // console.log(profile)
      
      return done(null, profile);
    }
  )
);


const bodyParser = require("body-parser");

app.post(
  "/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    
  }),
  function (req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    // console.log(req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
    res.redirect("/profile_with_authorization");
  }
);
// Initiate SAML authentication
app.get(
  "/login",
    function (req, res, next) {
      req.session.authorize=false;
      console.log(req.session.authorize);
      req.session.save(function (err) {
      if (err) {
        console.error('Error saving session:', err);
      }
      next();
    });
    },
  
    passport.authenticate("saml",{
    failureRedirect: "/",
    failureFlash: true,
    keepSessionInfo : false,
  })
);


app.get('/logout', (req, res) => {
    // Destroy the session
    req.logout(function(err){
      if (err) {
        console.error('Error destroying session:', err);
      }
      delete req.session.passport;
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        // Clear any cookies related to authentication
        res.clearCookie('connect.sid');
        
        // Redirect the user to the desired page after logout
        res.redirect('https://mukul1098.pythonanywhere.com/');
      });
    });
});

// Protected route example
app.get('/profile_with_authorization', ensureAuthenticated, (req, res) => {
  // Render user profile or protected content
  const usr =req.user;
  console.log(usr['http://schemas.auth0.com/user/roles'])
  res.render("pages/authorize_profile",{ title: 'Home',userdetails:JSON.stringify(usr), attr: usr["attributes"] ,usrname: usr['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] , role:usr['http://schemas.auth0.com/user/roles']});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
