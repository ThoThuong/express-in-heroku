const jwt = require('jsonwebtoken');

let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
        // cách để kí một cái token thì nó cần khóa bí mật và những thông tin chúng ta cần lưu trữ trong token
        //thuật toán
        jwt.sign(
            { data: user },
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            }, (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            }
        );
    });
}

let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decode) => {
            if (error) {
                return reject(error);
            }
            return resolve(decode)
        });
    });
}
module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
}