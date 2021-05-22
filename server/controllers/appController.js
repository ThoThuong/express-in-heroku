var Users = require('../model/user');
var invoices = require('../model/invoices');
UserAuthens = require('../model/userAuthen');
var fs = require('fs');
const accessTokenSecret = process.env.accessTokenSecret || 'khongphansumienvaook';
const jwtHelper = require('../helpers/jwt.helper');


// get infoUser
exports.infoUser = (req, res) => {
    res.redirect('/info-user')
}

/*
làm gồng file này một xíu tách ra sau
*/
// const Yolo = require('@vapi/node-yolo');

// exports.create = (req, res) => {
//     // validate request
//     if (!req.body) {
//         res.status(400).send({ message: "Content can not be emtpy!" });
//         return;
//     }

//     // new user
//     const user = new Users({
//         fullname: '',
//         email: req.body.email,
//         sdt: req.body.sdt || "",
//         birthDay: req.body.sdt || "",
//         isActive: req.body.isActive || true,
//         createTime: req.body.createTime || (new Date()).getTime.toString(),
//         updateTime: req.body.updateTime || (new Date()).getTime.toString(),
//         gender: req.body.gender || ""
//     })

//     // save user in the database
//     user
//         .save(user)
//         .then(data => {
//             //res.send(data)
//             res.send(data);
//             res.redirect('/');
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating a create operation"
//             });
//         });

// }
// exports.find = (req, res) => {
//     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//     console.log(fullUrl);
//     if (req.query.id) {
//         const id = req.query.id;
//         console.log(id);
//         Users.findById(id)
//             .then(data => {
//                 if (!data) {
//                     res.status(404).send({ message: "Not found user with id " + id })
//                 } else {
//                     res.send(data)
//                 }
//             })
//             .catch(err => {
//                 res.status(500).send({ message: "Erro retrieving user with id " + id })
//             })

//     } else {
//         Users.find()
//             .then(user => {
//                 res.send(user)
//             })
//             .catch(err => {
//                 res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
//             })
//     }
//     // res.render('landing', { title: 'all Users' });
// }


exports.updateInfoUser = (req, res) => {
    console.log(req.params);
    console.log((req.body));
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const { _id, data } = req.body;
    Users.findByIdAndUpdate(_id, data, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}


// exports.delete = (req, res) => {
//     const id = req.params.id;

//     Users.findByIdAndDelete(id)
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
//             } else {
//                 res.send({
//                     message: "User was deleted successfully!"
//                 })
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete User with id=" + id
//             });
//         });
// }
//




// API for invoice

exports.storeInfoInvoice = (req, res, next) => {
    res.status(200).json({ message: 'ok' });
}
exports.createInvoice = async (req, res) => {
    const data = req.body

    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    // req.jwtDecoded = decoded;
    let email = decoded.data.email;
    let password = decoded.data.password;

    const acc = await UserAuthens.findOne({ email, password });
    try {
        console.log(acc._id);
        let accountId = acc._id;
        data['idOwner'] = accountId
        let invoice = new invoices(data);
        invoice
            .save(invoice)
            .then(data => {
                return res.status(201).json({ data });
                // res.redirect('/');
            }).catch(err => {
                return res.status(500).json({
                    message: err.message || "Error, ReExtract"
                });
            }
            );

    } catch (error) {
        res.status(500).send({ message: "Error Update user information" })
    }
}
exports.updateInvoice = async (req, res, next) => {
    let data = req.body;

    let dataUpdate = {
        address: data.address,
        datetime: data.datetime,
        items: data.items,
        total: data.total,
        dateTimeUpdate: new Date(data.dateTimeUpdate)
    };
    console.log('--------------', data.idUpdate, dataUpdate);
    const resp = await invoices.findByIdAndUpdate(data.idUpdate, dataUpdate, { useFindAndModify: false })
    try {
        if (resp) {
            return res.status(200).json({ mes: 'ok' });
        } else {
            return res.status(404).json({ message: `Cannot Update user with ${data.idUpdate}. Maybe user not found!` });
        }
    } catch (err) {
        return res.status(500).json({ message: `Error Update user information ${err}` });
    }


}

exports.deleteInvoice = async (req, res, next) => {
    const id = req.body.itemid;
    try {
        let r = await invoices.findOneAndRemove({ _id: id });
        return res.status(200).json({ mess: 'success fully!' });
    } catch (error) {
        return res.status(400).json({ mess: `${err}` });
    }

}
// tạm thời ở đây xử lý request tới model


var ObjectId = require('mongodb').ObjectID;
exports.scanInvoices = async (req, res) => {

    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    let email = decoded.data.email
    const idUserOInvoice = await Users.findOne({ email });

    console.log(req.file);
    let data = req.file;
    var invoice = new invoices();
    invoice.img.data = fs.readFileSync(data.path);
    invoice.img.contentType = data.mimetype;
    invoice.dateTimeExtract = Date.now();
    invoice.dateTimeUpdate = Date.now();
    // luwu diwocj cais hinfh xuong cho cai hoa don roi tinh tieps casi doank day cai id cho thawng user
    invoice.save().then(data => {
        console.log(data);
        Users.updateOne(
            { _id: idUserOInvoice._id },
            { $push: { listInvoice: [ObjectId(data._id)] } }
        ).then(ok => {
            console.log('ok', ok);
            return res.status(200).json({ data, ok });
        }).catch(notok => {
            console.log('notok', notok);
        });
    }).catch(err => {
        console.log(err);
    });
}


//đáng lý ra thì phải gọi từ service qua
exports.modelPredict = async (req, res) => {
    let image = fs.readFileSync('uploads/image-1617268181778-3909453Funny-Minion-Quotes.jpg');
}



