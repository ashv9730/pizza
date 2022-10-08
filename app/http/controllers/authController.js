export default function authController() {
    return {
        // actual is like this refrence javascript object
        // index : (req,res) => {
        //     res.render("home");
        // }
        login(req,res) {
            res.render("auth/login");
        },
        register(req,res) {
            res.render("auth/register");
        },
    }
}