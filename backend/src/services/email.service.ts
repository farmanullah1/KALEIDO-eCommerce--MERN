import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string, role: 'buyer' | 'seller') => {
  const isSeller = role === 'seller';
  const mailOptions = {
    from: `"KALEIDO Overlords" <${process.env.SMTP_FROM || 'noreply@kaleido.com'}>`,
    to: email,
    subject: isSeller 
      ? "NEURAL LINK INITIALIZED: Welcome, Prospective Merchant" 
      : "NEURAL LINK ESTABLISHED: Welcome, Traveler",
    html: `
      <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #00ffff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(0,255,255,0.1); border: 1px solid #00ffff; border-radius: 15px; line-height: 60px; font-size: 30px; color: #00ffff;">⚡</div>
        </div>
        <h1 style="color: #00ffff; text-transform: uppercase; letter-spacing: 5px; text-align: center; margin-bottom: 30px;">Welcome to KALEIDO</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
          Greetings, <strong style="color: #ffffff;">${name}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
          \${isSeller 
            ? "Your merchant registration has been successfully initiated. The KALEIDO Overlords are currently analyzing your credentials. We will notify you once authorization is completed." 
            : "Your traveler account is fully synchronized. Step into the global catalog and explore premium 3D digital artifacts."}
        </p>
        <div style="background-color: #111; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #00ffff;">
          <p style="margin: 0; font-weight: bold; color: #00ffff; text-transform: uppercase; letter-spacing: 1px;">Status: Active</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #888;">
            \${isSeller 
              ? "Awaiting Moderator Authorization. Once approved, you will receive full access to manifest artifacts in the global catalog." 
              : "Neural link established successfully. You may start collecting or trading."}
          </p>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <a href="\${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 18px 40px; background-color: #00ffff; color: #000; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-radius: 8px; box-shadow: 0 0 20px rgba(0,255,255,0.3);">Enter Marketplace</a>
        </div>
        <p style="margin-top: 50px; font-size: 11px; color: #444; font-family: 'Courier New', Courier, monospace; text-align: center; border-top: 1px solid #222; padding-top: 20px;">
          NEURAL LINK ID: \${Math.random().toString(36).substring(2, 15).toUpperCase()}<br/>
          KALEIDO NEURAL NETWORK • DIMENSION: 08-WELCOME-SYNC
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to \${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

export const sendApprovalEmail = async (email: string, name: string, shopName: string) => {
  const mailOptions = {
    from: `"KALEIDO Overlords" <${process.env.SMTP_FROM || 'noreply@kaleido.com'}>`,
    to: email,
    subject: "NEURAL LINK ESTABLISHED: Merchant Credentials Authorized",
    html: `
      <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #00ffff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(0,255,255,0.1); border: 1px solid #00ffff; border-radius: 15px; line-height: 60px; font-size: 30px; color: #00ffff;">⚡</div>
        </div>
        <h1 style="color: #00ffff; text-transform: uppercase; letter-spacing: 5px; text-align: center; margin-bottom: 30px;">Authorization Complete</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
          Greetings, <strong style="color: #ffffff;">${name}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
          Your merchant credentials for <strong style="color: #ff00f5;">${shopName}</strong> have been verified by the KALEIDO Overlords.
        </p>
        <div style="background-color: #111; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #00ffff;">
          <p style="margin: 0; font-weight: bold; color: #00ffff; text-transform: uppercase; letter-spacing: 1px;">Status: Authorized</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #888;">You may now begin manifesting artifacts in the global catalog and managing your digital emporium.</p>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/dashboard" style="display: inline-block; padding: 18px 40px; background-color: #00ffff; color: #000; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-radius: 8px; box-shadow: 0 0 20px rgba(0,255,255,0.3);">Access Merchant Portal</a>
        </div>
        <p style="margin-top: 50px; font-size: 11px; color: #444; font-family: 'Courier New', Courier, monospace; text-align: center; border-top: 1px solid #222; pt: 20px;">
          NEURAL LINK ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}<br/>
          KALEIDO NEURAL NETWORK • DIMENSION: 08-AUTH-VERIFIED
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send approval email:', error);
  }
};

export const sendRejectionEmail = async (email: string, name: string) => {
    const mailOptions = {
      from: `"KALEIDO Overlords" <${process.env.SMTP_FROM || 'noreply@kaleido.com'}>`,
      to: email,
      subject: "NEURAL LINK TERMINATED: Merchant Credentials Rejected",
      html: `
        <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #ff0055; border-radius: 12px;">
          <h1 style="color: #ff0055; text-transform: uppercase; letter-spacing: 5px; text-align: center;">Authorization Failed</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
            Greetings, <strong style="color: #ffffff;">${name}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">
            We regret to inform you that your application for merchant status has been declined by the KALEIDO Overlords at this time.
          </p>
          <div style="background-color: #111; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #ff0055;">
            <p style="margin: 0; font-weight: bold; color: #ff0055; text-transform: uppercase; letter-spacing: 1px;">Status: Terminated</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #888;">Your current credentials do not meet our synchronization protocols. You may attempt another ritual in 30 cycles.</p>
          </div>
        </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Rejection email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }
  };
