
const NodeMailer = require("nodemailer");


module.exports = function (options) {
    const transporter = NodeMailer.createTransport(options);
    const sender = options.auth.user;
    
    return (address, subject, content) => {
        const mailOptions = {
            from: sender, // sender address
            to: address, // list of receivers
            subject: subject, // Subject line
            html: content// plain text body
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) reject(error);
                else resolve(info);
            });
        });        
    }
}
