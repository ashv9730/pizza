import LocalStrategy from "passport-local";
import User from "../models/user";
import bcrypt from "bcrypt";

export default function passportInit(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { messages: "User Not Found" });
        }
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { messages: "Logged In Successfully" });
            }
            return done(null, false, {
              messages: "Wrong UserName And Password",
            });
          })
          .catch((err) => {
            return done(null, false, { messages: "Something went Wrong" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}


