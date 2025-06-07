const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userSchema");
const dotenv = require("dotenv");


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value,
      });
      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: "google",
        isVerified: true,
      });
      done(null, newUser);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0].value;

      let existingUser;

      if (email) {
        existingUser = await User.findOne({ email });
      } else {
        existingUser = await User.findOne({
          providerId: profile.id,
          provider: "facebook",
        });
      }

      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: email || `${profile.id}@facebook.local`,
        provider: "facebook",
        providerId: profile.id,
        isVerified: true,
      });
      done(null, newUser);
    }
  )
);
