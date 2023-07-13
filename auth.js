const passport = require('passport');
const SamlStrategy = require("passport-saml").Strategy;
passport.use(new SamlStrategy({
    entryPoint:"https://dev-npofkt2fait2dmyy.us.auth0.com/samlp/w3mS9TGUc3huSRcViFeWEhbEYKcsusdE?connection=google-oauth2",
    issuer:"urn:dev-npofkt2fait2dmyy.us.auth0.com/",
    callbackUrl:"http://localhost:3000/callback",
    cert:'MIIDHTCCAgWgAwIBAgIJSi7z01cbQMBPMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjAxMDM1MDNaFw0zNjEwMjkxMDM1MDNaMCwxKjAoBgNVBAMTIWRldi1ucG9ma3QyZmFpdDJkbXl5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANlHohjY8jO9zuOOUvK0DNdxE8SOY68Di53JJqNHMg1+oDZoNVbMrEVBjaPqjNdS8Ld7UzRSAs+3DTjWjci0+NXqS+f9psb1LPovw1Fd1zqNw1p+Eh90mg7xYzvWKWlIrWlQIGtAKgCJhQp8tLMy6oxn4RYvFY7v2TBwOEeNpx/IXttwIzxUExeKHKwPfz9iihI10usVYVLaGnA6D+PhMFuxV/ZjhQ1I+MxjRV0TxkLLgSUqXA2czJInq3TPaZoCQSxkpCIMpPi6jR0HrN0+tWrkVdZM4gl3vXQrcopCq2jxjHQMpTUPE6cEJo++4xFMZbRXYLv7BcDUXR9BIMg7YeUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU4ZHsqBmjEWoXjbMwxi5faEmIAGIwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCCZX80lxRXdWkp2aEMj/IFsPvkI+m7RMj5OYfy8+aIQFUvHVSuok/9Dd9DedyFaszLZ4jNAJpVz8cjfZn7fkrNFd3dPEDwfQbmB7mN4SdsRXJWffy7coMUgVk38x3G7HlHlzKp18KES1UvyHZygzUEJTZR/wtUWURtEti/QdjJrq9XANwQhGAbD+3aYg0o36OaPyU1JbRCD6WUO8klnLcsg6EK4gLBaIc5B2Uaq3Vr3QaoDTKO8k0Z5lBvkagR/4BpNkcnAyPD/gjdhtOZ+KNfldi4xxoRNCI1yqFW3oszCQM/poOYuNyZGbV/gaQjQOdX4hBjGJ09mh+Cw3pYqw8u',
    debug:true,
},(profile,done) => {
    return done(null,profile);
}));

passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((user,done)=>{
    done(null,user);
});

passport.initialize();
passport.session();
module.exports=passport;