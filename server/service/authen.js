
exports.login = async (req, res, next) => {
    res.render('login/login', { title: "login page" });
}