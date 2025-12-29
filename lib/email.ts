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

    // In production, implement actual email sending here
    // Example with a real provider:
    // await emailProvider.send({
    //   to,
    //   subject: 'Verify your email address',
    //   html: generateVerificationEmailHtml(verificationUrl),
    // });

    // For now, throw an error if email is not configured in production
    if (!process.env.EMAIL_PROVIDER_CONFIGURED) {
        throw new Error('Email service not configured. Set EMAIL_PROVIDER_CONFIGURED=true when ready.');
    }
}

