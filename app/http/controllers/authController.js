import User from "../../models/user";
import bcrypt from "bcrypt";
import passport from "passport";

export default function authController() {

  const _getRedirectUrl = (req) => {
    return req.user.role === 'admin'? '/admin/orders' : '/'
  }

  return {
    // actual is like this refrence javascript object
    // index : (req,res) => {
    //     res.render("home");
    // }
    login(req, res) {
      res.render("auth/login");
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      // console.log(req.body)

      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          req.flash("error", "All field required");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }

        const userSearch = await User.findOne({ email });
        if (userSearch) {
          req.flash("error", "User already registered Plz Login?");
          return res.redirect("/register");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        // console.log(hashPassword);
        const user = new User({
          name,
          email,
          password: hashPassword,
        });
        const userSave = await user.save();

        res.redirect("/");
      } catch (error) {
        res.send({ error: error.message });
      }
    },
    postLogin(req, res, next) {
      try {
        const { email, password } = req.body;
        // Validate request
        if (!email || !password) {
          req.flash("error", "All fields are required");
          req.flash('email' , email)
          return res.redirect("/login");
        }
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            req.flash("error", info.messages);
            return next(err);
          }
          if (!user) {
            req.flash("error", info.messages);
            return res.redirect("/login");
          }
          req.logIn(user, (err) => {
            if (err) {
              req.flash("error", info.messages);
              return next(err);
            }
            // return res.redirect("/");
            return res.redirect(_getRedirectUrl(req))
          });
        })(req, res, next);
      } catch (error) {
        res.send({ error: error.message });
      }
    },
    logout(req, res) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    },
  };
}
