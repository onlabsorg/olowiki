const EMail = require("../lib/email");

const email = new EMail({
    service: "gmail",
    auth: {
        user: "no-reply@onlabs.org",
        pass: "n0rep_cznod2oq7"
    }        
});

email.send("m.delbuono@gmail.com", "test", "this is an olojs email service test")
.then(retval => console.log(retval))
.catch(err => {throw err});
