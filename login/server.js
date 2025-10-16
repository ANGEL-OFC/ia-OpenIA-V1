// server.js
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();

// Session
app.use(session({ secret: "SECRET_KEY", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serializar usuario
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

// Google
passport.use(new GoogleStrategy({
  clientID: "TU_CLIENT_ID_GOOGLE",
  clientSecret: "TU_CLIENT_SECRET_GOOGLE",
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => { return done(null, profile); }));

// Facebook
passport.use(new FacebookStrategy({
  clientID: "TU_APP_ID_FACEBOOK",
  clientSecret: "TU_APP_SECRET_FACEBOOK",
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => { return done(null, profile); }));

// GitHub
passport.use(new GitHubStrategy({
  clientID: "TU_CLIENT_ID_GITHUB",
  clientSecret: "TU_CLIENT_SECRET_GITHUB",
  callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => { return done(null, profile); }));

// Rutas OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req,res) => res.send(`¡Hola ${req.user.displayName}!`));

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req,res) => res.send(`¡Hola ${req.user.displayName}!`));

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req,res) => res.send(`¡Hola ${req.user.username}!`));

// Servir frontend
app.use(express.static("."));

// Iniciar server
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));