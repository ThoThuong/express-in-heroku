
var UserAuthens = require('../model/userAuthen');
var Users = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtHelper = require('../helpers/jwt.helper');
var ObjectId = require('mongodb').ObjectID;

// local variable to stored token list
let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1d";
const accessTokenSecret = process.env.accessTokenSecret || 'khongphansumienvaook';
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "tooinoislaijkhoongphanasuwjmieenvaof";

exports.submitLogin = async (req, res, next) => {
    try {
        const { message, email, password, remmeber } = req.body;
        console.log(message, email, password, remmeber);

        const isUserLogin = await UserAuthens.findOne({ email });
        if (!isUserLogin) {
            return res.status(404).json({ EmailError: "Incorect Email, not found user" });
        }
        const userLoginForToken = {
            'email': isUserLogin.email,
            'password': isUserLogin.password,
            'remmeber': remmeber ?? false
        }
        if (await bcrypt.compare(password, isUserLogin.password)) {
            const accessToken = await jwtHelper.generateToken(userLoginForToken, accessTokenSecret, accessTokenLife);
            const refreshToken = await jwtHelper.generateToken(userLoginForToken, refreshTokenSecret, refreshTokenLife);
            tokenList[refreshToken] = { accessToken, refreshToken };
            res.cookie('x-www-au', { accessToken, refreshToken });
            // return res.status(200).json({ url: 'http:localhost:3000/' });
            return res.redirect('/');
        } else {
            return res.status(401).json({ PasswordError: "Incorrect password" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }

}

exports.refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            const userLogin = decoded.data;
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
            return res.status(200).json({ accessToken });
        } catch (error) {
            // Không tìm thấy token trong request
            return res.status(403).send({
                message: 'No token provided.',
            });
        }
    }
}

exports.submitRegister = async (req, res, next) => {
    const SUCCESS = 'Valid';
    const ERROR = "Invalid"
    const {
        username, email, password,
        rePassword, term
    } = req.body;

    let dataRgister = {
        'infoUsername': username,
        'infoEmail': email,
        'infoPassword': password,
        'infoRePassword': rePassword,
        'infoTerm': term

    }
    let infoDataRegister = {
        'infoUsername': 'init',
        'infoEmail': 'init',
        'infoPassword': 'init',
        'infoRePassword': 'init',
        'infoTerm': 'init'
    };
    for (const key in dataRgister) {
        switch (key) {
            case 'infoUsername':
                infoDataRegister[key] = SUCCESS;
                if (dataRgister[key] === "" || dataRgister[key] === undefined || dataRgister[key] === 'undefined' || dataRgister[key] === null || dataRgister[key] === 'null') {
                    infoDataRegister[key] = `Invalidate ${key}`;
                }
                break;
            case 'infoEmail':
                infoDataRegister[key] = SUCCESS;
                if (dataRgister[key] === "" || dataRgister[key] === undefined || dataRgister[key] === 'undefined' || dataRgister[key] === null || dataRgister[key] === 'null') {
                    infoDataRegister[key] = `${ERROR} ${key}`;
                }
                break;
            case 'infoPassword':
                infoDataRegister[key] = SUCCESS;
                if (dataRgister[key] === "" || dataRgister[key] === undefined || dataRgister[key] === 'undefined' || dataRgister[key] === null || dataRgister[key] === 'null') {
                    infoDataRegister[key] = `${ERROR} ${key}`;
                }
                break;
            case 'infoRePassword':
                if (dataRgister[key] === "" || dataRgister[key] === undefined || dataRgister[key] === 'undefined' || dataRgister[key] === null || dataRgister[key] === 'null') {
                    infoDataRegister[key] = `${ERROR} ${key}`;
                } else {
                    if (dataRgister[key] === dataRgister['infoPassword']) {
                        infoDataRegister[key] = SUCCESS;
                    } else {
                        infoDataRegister[key] = `${ERROR} ${key}`;
                    }
                }
                break;
            case 'infoTerm':

                infoDataRegister[key] = `${ERROR} ${key}`;
                if (String(dataRgister[key]).toLocaleLowerCase() === 'true') {
                    infoDataRegister[key] = SUCCESS;
                }
                break;
        }
    }

    const conditionValidAll = (ele) => ele === SUCCESS;
    let isValid = await Object.values(infoDataRegister).every(conditionValidAll);
    if (!isValid) {
        res.status(400).json({ message: "Invalid paramaster", infoDataRegister });
        return;
    }

    let passwordBcrypt = await bcrypt.hash(password, 10);
    let newUserAuthen = new UserAuthens({
        username: username,
        email: email,
        password: passwordBcrypt,
        permissionLevel: 0,
        token: "null"
    });
    let resultCreatAccount;
    try {
        resultCreatAccount = await newUserAuthen.save(newUserAuthen);
        const date = new Date();
        const user = new Users({
            accountId: resultCreatAccount._id,
            fullname: resultCreatAccount.username,
            email: resultCreatAccount.email,
            sdt: '',
            birthDay: '',
            createTime: date,
            updateTime: date,
            gender: '',
            address: '',
            listInvoice: []
        });
        result = await user.save(user);
        return res.status(201).json({ status: "A new resource is created", result });
        // return res.redirect('/');

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({
                "message": "duplicate email",
                "message detail": error.message
            });
        }
        return res.status(500).json({ message: "Some error occurred while creating a create operation" });

    }
}

exports.logout = async (req, res, next) => {
    res.clearCookie('x-www-au');
    return res.redirect('/authen/login');
}





