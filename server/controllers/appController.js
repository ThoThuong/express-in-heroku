var Users = require('../model/user');
var invoices = require('../model/invoices');
const s3Upload = require('../helpers/s3Upload');
UserAuthens = require('../model/userAuthen');

var fs = require('fs');
const accessTokenSecret = process.env.accessTokenSecret || 'khongphansumienvaook';
const jwtHelper = require('../helpers/jwt.helper');


// get infoUser
exports.infoUser = (req, res) => {
    res.redirect('/info-user')
}

exports.updateInfoUser = (req, res) => {
    // console.log(req.params);
    // console.log((req.body));
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" });
    }

    const { id, data } = req.body;

    try {

        Users.findOneAndUpdate({ _id: id }, data, function (error, result) {
            if (error) {
                return res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` });
            }
            Users.findById({ _id: result._id }).then((dtrp) => {
                return res.status(200).send(dtrp);
            }).catch(err => {
                return res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` });
            })
        });


    } catch (error) {
        return res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` });
    }
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
    console.log('vaof taoj hoas donw');
    const data = req.body;
    const { imageResult } = data;

    let cookie = req.cookies['x-www-au'];
    let decoded = await jwtHelper.verifyToken(cookie.accessToken, accessTokenSecret);
    // req.jwtDecoded = decoded;
    let email = decoded.data.email;
    let password = decoded.data.password;

    const acc = await UserAuthens.findOne({ email, password });
    try {
        console.log(acc._id);
        let accountId = acc._id;
        // const imgBase64 = imageResult[0].replace(/^data:image\/png;base64,/, "");
        let imgBase64 = imageResult[0];
        imgBase64 = imgBase64.split('base64,').pop();

        s3Upload.uploadFilev2(imgBase64, accountId, 'imageResult').then(s3Respon => {
            data['idOwner'] = accountId;
            data['imageResult'] = s3Respon.location ? s3Respon.location : imageResult[0];
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
        }).catch(err => {
            console.log('errr', err);
            return res.status(500).send({ message: `Error s3 ${err}` });
        });
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
const { log } = require('util');
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



