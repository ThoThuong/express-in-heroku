var User = require('../model/user');
var Invoice = require('../model/invoices');
var UserAuthen = require('../model/userAuthen');
var PaginationTest = require('../model/pagination-test-model');
const faker = require('faker');

exports.pagination = (req, res, next) => {

    // for (let i = 0; i < 96; i++) {
    //     const newprd = new PaginationTest();
    //     newprd.name = faker.commerce.productName()
    //     newprd.price = faker.commerce.price()
    //     newprd.cover = faker.image.image()
    //     newprd.save();
    // }


    let perPage = 16; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.pageNumber || 1;
    PaginationTest
        .find() // find tất cả các data
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, products) => {
            PaginationTest.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
                if (err) return next(err);
                // res.send(products) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                res.render('pagination-test', {
                    products, // sản phẩm trên một page
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage) // tổng số các page
                });
            });
        });




    // return res.render('pagination-test');
}




// exports.updateUserController = async (req, res, next) => {

//     // const newInvoice = new Invoice({
//     //     dateTimeOnInvoice: String(new Date()),

//     //     items: [
//     //         {

//     //             nameItem: 'Bò cụng',

//     //             quantity: '10',
//     //             price: '10.000'
//     //         },
//     //         {
//     //             nameItem: 'TH True milk',
//     //             quantity: '10',
//     //             price: '10.000'
//     //         }
//     //     ],
//     //     total: '200.000',
//     //     dateTimeExtract: String(new Date()),
//     //     dateTimeUpdate: '',
//     // });
//     // newInvoice.save(newInvoice).then((data) => {
//     //     console.log('ok');
//     //     console.log(data);
//     // }).catch((err) => {
//     //     console.log(err);
//     // })
//     let _id = '6084e878ccf7632e9847b948'
//     let result = await Invoice.findOne({ _id });
//     Invoice.findByIdAndUpdate(
//         { _id: _id },
//         {
//             $push: {
//                 items: {

//                     nameItem: 'glister',

//                     quantity: '2',
//                     price: '250.000'
//                 },
//             }
//         },
//         { new: true, upsert: true }
//     ).exec();

//     return res.status(200).json({ message: result.img });
// }
