const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const app = express();

// Set up session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new SamlStrategy(
    {
      callbackUrl: "http::/localhost:3000/callback",
      entryPoint: "https://dev-npofkt2fait2dmyy.us.auth0.com/samlp/w3mS9TGUc3huSRcViFeWEhbEYKcsusdE?connection=Username-Password-Authentication",
      issuer: "http::/localhost:3000/callback",
      cert: "MIIDHTCCAgWgAwIBAgIJSi7z01cbQMBPMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjAxMDM1MDNaFw0zNjEwMjkxMDM1MDNaMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANlHohjY8jO9zuOOUvK0DNdxE8SOY68Di53JJqNHMg1+oDZoNVbMrEVBjaPqjNdS8Ld7UzRSAs+3DTjWjci0+NXqS+f9psb1LPovw1Fd1zqNw1p+Eh90mg7xYzvWKWlIrWlQIGtAKgCJhQp8tLMy6oxn4RYvFY7v2TBwOEeNpx/IXttwIzxUExeKHKwPfz9iihI10usVYVLaGnA6D+PhMFuxV/ZjhQ1I+MxjRV0TxkLLgSUqXA2czJInq3TPaZoCQSxkpCIMpPi6jR0HrN0+tWrkVdZM4gl3vXQrcopCq2jxjHQMpTUPE6cEJo++4xFMZbRXYLv7BcDUXR9BIMg7YeUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU4ZHsqBmjEWoXjbMwxi5faEmIAGIwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCCZX80lxRXdWkp2aEMj/IFsPvkI+m7RMj5OYfy8+aIQFUvHVSuok/9Dd9DedyFaszLZ4jNAJpVz8cjfZn7fkrNFd3dPEDwfQbmB7mN4SdsRXJWffy7coMUgVk38x3G7HlHlzKp18KES1UvyHZygzUEJTZR/wtUWURtEti/QdjJrq9XANwQhGAbD+3aYg0o36OaPyU1JbRCD6WUO8klnLcsg6EK4gLBaIc5B2Uaq3Vr3QaoDTKO8k0Z5lBvkagR/4BpNkcnAyPD/gjdhtOZ+KNfldi4xxoRNCI1yqFW3oszCQM/poOYuNyZGbV/gaQjQOdX4hBjGJ09mh+Cw3pYqw8u"
    },
    function (profile, done) {
      // for signon
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
    console.log("success");
    res.redirect("/profile");
  }
);

// Initiate SAML authentication
app.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  function (req, res) {
    res.redirect("/");
  }
);


app.get('/', (req, res) => {
    res.send('home');
  });

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
        return res.status(500).json({ error: err });
      }
      res.redirect('/');
    });
  });

// Protected route example
app.get('/profile', ensureAuthenticated, (req, res) => {
  // Render user profile or protected content
  res.send("Success");
});

// Serialize user session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user session
passport.deserializeUser((user, done) => {
  done(null, user);
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
