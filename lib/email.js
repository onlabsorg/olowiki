
const NodeMailer = require("nodemailer");

class EMail {
    
    constructor (options) {
        this.transporter = NodeMailer.createTransport(options);
        this.from = options.auth.user;
    }
    
    send (address, subject, content) {
        const mailOptions = {
            from: this.from, // sender address
            to: address, // list of receivers
            subject: subject, // Subject line
            html: content// plain text body
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) reject(error);
                else resolve(info);
            });
        });        
    }
}


module.exports = EMail;
