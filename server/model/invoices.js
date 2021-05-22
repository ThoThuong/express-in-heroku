const mongoose = require('mongoose');
var invoiceSchema = new mongoose.Schema({
    address: {
        type: String
    },
    datetime: {
        type: Date
    },
    items: [{
        type: String
    }],
    total: {
        type: String
    },
    dateTimeExtract: {
        type: Date,
        require: true,
    },
    dateTimeUpdate: {
        type: Date,
        require: true,
    },
    imageResult: [{
        type: String
    }],
    idOwner: String
});

const invoices = mongoose.model('invoices', invoiceSchema);
module.exports = invoices;

// img: {
//     data: Buffer,
//         contentType: String
// }


// dateTimeOnInvoice: {
//     type: String
// },
// items: [
//     {
//         nameItem: {
//             type: String
//         },
//         quantity: {
//             type: String
//         },
//         price: {
//             type: String
//         }
//     }
// ],
//     total: {
//     type: String
// },
// dateTimeExtract: {
//     type: Date,
//         require: true,
//     },
// dateTimeUpdate: {
//     type: Date,
//         require: true,
//     },
// imageResult: {
//     type: String
// },
// imageOrigin: {
//     type: String
// }