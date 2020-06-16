const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = async (user, req, res) => {

    const verifToken = user.generateVerificationToken()

    try {
        await verifToken.save()

        let link="http://"+req.headers.host+"/users/verify/"+verifToken.verifToken;

        await sgMail.send({
            to: user.email,
            from: 'csaba.arato@gmail.com',
            subject: 'User verification email',
            text:  `Hi ${user.name} ! Please click on the following ${link} link to verify your account.
                  If you did not request this, please ignore this email.`
        })

        res.send({msg: "Verification email sent to: " +user.email})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}

module.exports = {
    sendVerificationEmail
}
