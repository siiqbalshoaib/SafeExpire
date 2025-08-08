import nodemailer from 'nodemailer';

const sendContactFormMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL, // Replace with your Gmail address
                pass: process.env.GMAIL_PASSWORD, // Replace with your Gmail app password
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.GMAIL, // Replace with your Gmail address
            subject: `Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};


export {sendContactFormMessage};