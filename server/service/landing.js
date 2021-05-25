
var UserAuthens = require('../model/userAuthen');
var Users = require('../model/user');
const jwtHelper = require('../helpers/jwt.helper');
const accessTokenSecret = process.env.accessTokenSecret || 'khongphansumienvaook';
var ObjectId = require('mongodb').ObjectID;
var invoice = require('../model/invoices')

const axios = require('axios');
const { log } = require('debug');

exports.renderHomePage = async (req, res, next) => {
    // var fullUrl = req.protocol + '://' + req.get('host');
    try {
        let info = req.jwtDecoded;
        let shortEmailUser = info.data.email.split('@')[0];
        res.render('landing', { title: `Hello ${shortEmailUser}` });
    } catch (error) {
        res.render('error', { message: "page not found", error });
    }
}

exports.submit_email = (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    console.log("email", req.body.email);
    res.redirect('/');
}

exports.renderInfoUser = async (req, res, next) => {

    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    req.jwtDecoded = decoded;
    let email = decoded.data.email;
    let password = decoded.data.password;

    UserAuthens.findOne({ email, password }).then(acc => {
        let accountId = acc._id;
        Users.findOne({ accountId }).then(userInfo => {

            if (!userInfo) {
                return res.send('not found this profile ');
            } else {
                // console.log(userInfo.sdt, 'casi gif ddaay', userInfo);
                return res.render('user', {
                    thisUser: userInfo
                });
            }

        });
    }).catch(error => {
        return res.send(error);
    })

}
exports.renderListInvoice = async (req, res, next) => {


    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    let email = decoded.data.email;
    let password = decoded.data.password;

    const acc = await UserAuthens.findOne({ email, password });
    let idcp = acc._id;
    // const listInvoice = await invoice.find({ idOwner: idcp });
    console.log(idcp)
    let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.pageNumber || 1;
    invoice
        .find({ idOwner: idcp }) // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, invoices) => {
            invoice.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
                if (err) return next(err);
                // res.send(products) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                res.render('invoices', {
                    list: invoices, // sản phẩm trên một page
                    current: page, // page hiện tại
                    pages: perPage >= count ? 1 : Math.ceil(count / perPage), // tổng số các page
                    totalInvoice: invoices.length
                });
                // return res.render('invoices', { list: listInvoice });
            });
        });


    // return res.render('invoices', { list: listInvoice });

}

function compareDate(dateTarget, dateFrom, dateTo) {
    const dateFromS = new Date(dateFrom);
    const dateToS = new Date(dateTo);
    const dateTargetS = new Date(dateTarget);

    if (
        dateTargetS.getFullYear() > dateFromS.getFullYear() &&
        dateTargetS.getFullYear() < dateToS.getFullYear()
    ) {
        return true;
    } else if (
        dateTargetS.getFullYear() < dateFromS.getFullYear() ||
        dateTargetS.getFullYear() > dateToS.getFullYear()
    ) {
        return false;
    } else {
        if (
            dateTargetS.getMonth() > dateFromS.getMonth() &&
            dateTargetS.getMonth() < dateToS.getMonth()
        ) {
            return true;
        } else if (
            dateTargetS.getMonth() < dateFromS.getMonth() ||
            dateTargetS.getMonth() > dateToS.getMonth()
        ) {
            return false;
        } else {
            if (
                dateTargetS.getDate() > dateFromS.getDate() &&
                dateTargetS.getDate() < dateToS.getDate()
            ) {
                return true;
            } else if (
                dateTargetS.getDate() < dateFromS.getDate() ||
                dateTargetS.getDate() > dateToS.getDate()
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}
exports.sati = async (req, res, next) => {
    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    let email = decoded.data.email;
    let password = decoded.data.password;

    const acc = await UserAuthens.findOne({ email, password });
    idcp = acc._id;
    const tt = await invoice.find({ idOwner: idcp })
    let listItem = tt.filter(ele => {
        let eleValid = compareDate(ele.datetime, req.query['datefrom'], req.query['dateto']);
        if (eleValid) {
            return ele;
        }
    });

    let sum = listItem.reduce((sum, index) => {
        t = index.total.replace(/,\s*/g, "");
        currentT = Number(t) ? Number(t) : 0;
        return sum + currentT;
    }, 0);

    sum = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(sum)
    total = listItem.length;
    // let listResult = await invoice.find({ idOwner: idcp, _id: { $in: listID } });
    let info = await Users.findOne({ accountId: idcp });
    let info2 = await UserAuthens.findOne({ email, password });
    let { fullname } = info;
    let { username } = info2;
    console.log(info.fullname, info2['username']);
    const dataResponse = {
        tsp: sum,
        qt: total,
        fr: listItem,
        e: email,
        fn: fullname ? fullname : username,
        pnb: info2.sdt ? info2.sdt : '',
        dfr: req.query['datefrom'],
        dto: req.query['dateto']
    }

    if (total) {
        res.render('sati', { data: dataResponse });
    } else {
        res.render('sati', { data: dataResponse });
    }


}
// exports.homeRoutes = (req, res) => {
//     // Make a get request to /api/users
//     axios.get('http://localhost:3000/api/users')
//         .then(function (response) {
//             res.render('index', { users: response.data });
//         })
//         .catch(err => {
//             res.send(err);
//         })

// }

// exports.add_user = (req, res) => {
//     res.render('add_user');
// }

// exports.update_user = (req, res) => {
//     axios.get('http://localhost:3000/api/users', { params: { id: req.query.id } })
//         .then(function (userdata) {
//             res.render("update_user", { user: userdata.data })
//         })
//         .catch(err => {
//             res.send(err);
//         })
// }

