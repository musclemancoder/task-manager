const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

// sgMail.send({
//     to:'vishalchowdhary.ce@gmail.com',
//     from:'vishalchowdhary.ce@gmail.com',
//     subject:'My First Mail',
//     text:'hellow world!'

// })

const sendWelcomeMail =(email,name) => {
    sgMail.send({
        to:email,
        from:'vishalchowdhary.ce@gmail.com',
        subject:`Welcome ${name}`,
        text:'Thanks for signing up to the task app'
    })
}
const sendGoodByeMail =(email,name) => {
    sgMail.send({
        to:email,
        from:'vishalchowdhary.ce@gmail.com',
        subject:`Sorry to see you go! ${name}`,
        text:'please send us the feedback! why you have left the task app'
    })
}

module.exports = {
    sendWelcomeMail,
    sendGoodByeMail
}