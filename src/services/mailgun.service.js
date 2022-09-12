const config = require('../config/config');
const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: config.mailgun.apikey, domain: config.mailgun.domain });

const data = {
    from: "Mailgun Sandbox <postmaster@mg.bitcointravelers.com>",
    to: "gustavopiucco@gmail.com",
    subject: "Hello",
    template: "email_confirmation",
    'h:X-Mailgun-Variables': JSON.stringify({
        test: "test"
    })
};
mg.messages().send(data, function (error, body) {
    console.log(body);
});

module.exports = {

};