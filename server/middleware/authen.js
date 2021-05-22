const jwtHelper = require('../helpers/jwt.helper');

const accessTokenSecret = process.env.accessTokenSecret || 'khongphansumienvaook';

exports.authen = async (req, res, next) => {

    let cookie = req.cookies['x-www-au'];
    if (cookie) {
        try {
            let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            // return res.status(401).json({
            //     message: 'Unauthorized.',
            // });
            res.redirect('/authen/login');
        }
    } else {
        // return res.status(403).json({ message: 'No token provided' });
        res.redirect('/authen/login');
    }
}

