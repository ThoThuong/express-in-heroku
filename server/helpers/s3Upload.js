const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
// const ID = 'AKIAZRW6XNMT3R3OXJGM';
// const SECRET = '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';
const ID = 'AKIA43BSGHY5UCBKWG2H';
const SECRET = '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';
const BUCKET_NAME = 'ocr-flask-nodejs';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "ap-southeast-1"
//     }
// };


exports.uploadFilev2 = async (listImage, idUSer, labelItem) => {


    let links = await Promise.all(listImage.map(async (file, index) => {
        bas64String = file.split('base64,').pop();
        const uniqueImageName = uuidv4();
        const image = Buffer.from(bas64String, "base64");
        // fs.writeFileSync("new-path.jpg", buffer);
        const params = {
            Bucket: `${BUCKET_NAME}/${idUSer}`,
            Key: `${uniqueImageName}-${labelItem}-img-${index}.jpeg`, // File name you want to save as in S3
            // Body: `data:image/jpeg;base64, ${bas64String}`
            Body: image
        }
        const { ETag, Location, Key, Bucket } = await s3.upload(params).promise();
        const amazonResponse = {
            eTag: ETag,
            location: Location,
            key: Key,
            bucket: Bucket
        }
        return amazonResponse
    })).then(data => data).catch(err => {
        console.log(err.name, '----', err.mesage);
        throw err;
    });
    return links;

}
// uploadFilev2(objectImgbase64.imageResult, 'user1', (Object.keys(objectImgbase64))[0]);