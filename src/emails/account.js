const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'csaba.arato@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the app ${name}.`
    })
}

const sendUserCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'csaba.arato@gmail.com',
        subject: 'User deleted',
        text: `Sorry to leave us ${name}  :(`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendUserCancellationEmail
}
