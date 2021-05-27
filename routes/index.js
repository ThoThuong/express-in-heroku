const express = require('express');
const router = express.Router();
const landing = require('../server/service/landing');
const controller = require('../server/controllers/appController');
/* GET home page. */
const middlwareAuthen = require('../server/middleware/authen');
router.get('/', middlwareAuthen.authen, landing.renderHomePage);
router.get('/api/info-user', middlwareAuthen.authen, landing.renderInfoUser);

router.get('/api/list-invoice/:pageNumber', middlwareAuthen.authen, landing.renderListInvoice);
router.get('/api/sati', middlwareAuthen.authen, landing.sati);
router.post('/', landing.submit_email);// tesst


// API for user
// router.post('/api/users', middlwareAuthen.authen, controller.create);
// router.get('/api/users', middlwareAuthen.authen, controller.find);
// router.post('/api/update-info-user', middlwareAuthen.authen, controller.updateInfoUser);
router.post('/api/update-info-user',middlwareAuthen.authen, controller.updateInfoUser);
// router.delete('/api/users/:id', middlwareAuthen.authen, controller.delete);


// API for save info extract from invoice
router.post('api/store-info-invoice', middlwareAuthen.authen, controller.storeInfoInvoice)







// API for invoice
router.post('/api/create-invoice', controller.createInvoice);
router.post('/api/update-invoice', controller.updateInvoice);
router.delete('/api/delete-invoice', controller.deleteInvoice);

// main process tmp here

// app.post('/api/scan-invoices', upload, (req, res) => {
//   console.log(req.file, req.files, req.body, req.header);
//   let data = req.file || req.files;
//   // return res.status(200).json({ data })
//   return res.status(200).json({ datafiles: data });
// });
var multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    }
});

let upload = multer({ storage: storage }).single('image');
router.post('/api/scan-invoices', upload, controller.scanInvoices);
router.post('/api/test/model-predict', controller.modelPredict)
module.exports = router;

