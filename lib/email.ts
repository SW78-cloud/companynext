/**
 * Email service stub for development
 * In production, replace this with a real email provider (e.g., SendGrid, Resend, AWS SES)
 */

export interface SendVerificationEmailParams {
    to: string;
    verificationToken: string;
    verificationUrl: string;
}

export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<void> {
    const { to, verificationToken, verificationUrl } = params;

    // In development, just log the email details
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 [EMAIL STUB] Verification email would be sent:');
        console.log('  To:', to);
        console.log('  Verification URL:', verificationUrl);
        console.log('  Token:', verificationToken);
        console.log('\n  In production, this would send a real email.');
        return;
    }

    // Production Implementation: Simple SMTP via Nodemailer (Example)
    // You must install nodemailer: npm install nodemailer
    /*
    const nodemailer = await import('nodemailer');
    
    // Check for required env vars
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Company Next" <noreply@companynext.com>',
        to,
        subject: 'Verify your email address',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to Company Next!</h2>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                <p>Or paste this link in your browser: <br>${verificationUrl}</p>
            </div>
        `,
    });
    */

    // Placeholder to prevent crash until configured
    console.warn("⚠️ Production email provider not yet configured. See lib/email.ts to uncomment NodeMailer logic.");
}

