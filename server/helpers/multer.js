// SET STORAGE
var multer = require('multer');
var fs = require('fs');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    }
});
exports.upload = multer({ storage: storage }).single('image');