const nodemailer = require('nodemailer');
const AIspire_url = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});


// Admin notification email - Clean and minimal like the example
const sendFeedbackNotification = async (feedback) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!ADMIN_EMAIL) {
    console.warn('⚠️ ADMIN_EMAIL not configured');
    return null;
  }

  const safeMessage = (feedback.message || '').replace(/\r\n/g, '\n').replace(/\0/g, '').slice(0, 5000);
  const subject = `New ${feedback.type || 'feedback'} from ${feedback.name || 'Anonymous'}`;
  
  const typeLabelMap = {
    bug: 'Bug Report',
    feature: 'Feature Request',
    suggestion: 'Suggestion',
    other: 'General Feedback',
  };

  const typeColorMap = {
    bug: '#fee2e2',
    feature: '#dcfce7',
    suggestion: '#dbeafe',
    other: '#f3f4f6',
  };

  const typeTextColorMap = {
    bug: '#991b1b',
    feature: '#166534',
    suggestion: '#1e40af',
    other: '#374151',
  };

  const type = (feedback.type || 'other').toLowerCase();
  const typeLabel = typeLabelMap[type] || 'General Feedback';
  const typeColor = typeColorMap[type] || typeColorMap.other;
  const typeTextColor = typeTextColorMap[type] || typeTextColorMap.other;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f5f5f5; padding:40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:40px 40px 20px;">
                    <h1 style="margin:0 0 8px; color:#1f2937; font-size:24px; font-weight:600;">
                      New Feedback Received
                    </h1>
                    <p style="margin:0; color:#6b7280; font-size:14px;">
                      AIspire Platform Notification
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="border-top:1px solid #e5e7eb;"></div>
                  </td>
                </tr>

                <!-- Type Badge -->
                <tr>
                  <td style="padding:24px 40px 20px;">
                    <div style="display:inline-block; background:${typeColor}; color:${typeTextColor}; padding:6px 12px; border-radius:4px; font-size:13px; font-weight:500;">
                      ${typeLabel}
                    </div>
                  </td>
                </tr>

                <!-- User Details -->
                <tr>
                  <td style="padding:0 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:8px 0; width:100px; color:#6b7280; font-size:14px; vertical-align:top;">Name</td>
                        <td style="padding:8px 0; color:#1f2937; font-size:14px; font-weight:500;">${feedback.name || 'Anonymous'}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6b7280; font-size:14px; vertical-align:top;">Email</td>
                        <td style="padding:8px 0;">
                          ${feedback.email ? `<a href="mailto:${feedback.email}" style="color:#2563eb; text-decoration:none; font-size:14px;">${feedback.email}</a>` : '<span style="color:#9ca3af; font-size:14px;">Not provided</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6b7280; font-size:14px; vertical-align:top;">User ID</td>
                        <td style="padding:8px 0; color:#1f2937; font-size:14px; font-family:monospace;">
                          ${feedback.userId || '<span style="color:#9ca3af;">Not logged in</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6b7280; font-size:14px; vertical-align:top;">Page URL</td>
                        <td style="padding:8px 0;">
                          ${feedback.pageUrl ? `<a href="${feedback.pageUrl}" style="color:#2563eb; text-decoration:none; font-size:13px; word-break:break-all;">${feedback.pageUrl}</a>` : '<span style="color:#9ca3af; font-size:14px;">Not provided</span>'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6b7280; font-size:14px; vertical-align:top;">Page URL</td>
                        <td style="padding:8px 0;">
                          ${feedback.ipAddress ? `<h1  style="color:#2563eb; text-decoration:none; font-size:13px; word-break:break-all;">${feedback.ipAddress}</h1>` : '<span style="color:#9ca3af; font-size:14px;">Not provided</span>'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message Box -->
                <tr>
                  <td style="padding:0 40px 30px;">
                    <div style="background:#f9fafb; border:1px solid #e5e7eb; border-left:3px solid #1f2937; border-radius:4px; padding:20px;">
                      <div style="color:#6b7280; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
                        MESSAGE
                      </div>
                      <div style="color:#1f2937; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word;">
${safeMessage}
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px 40px; text-align:center; border-top:1px solid #e5e7eb;">
                    <p style="margin:0 0 16px; color:#6b7280; font-size:13px;">
                      AIspire · Automated notification
                    </p>
                    <p style="margin:0; color:#9ca3af; font-size:12px;">
                      © ${new Date().getFullYear()} All rights reserved
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AIspire Notifications" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    console.log('✓ Admin notification sent');
    return info;
  } catch (err) {
    console.error('✗ Admin notification failed:', err.message);
    throw err;
  }
};

// User thank you email - Exactly like the example image
const sendUserThankYouEmail = async (feedback) => {
  if (!feedback.email) {
    console.warn('⚠️ User email not provided');
    return null;
  }

  const subject = 'Thank You for Your Feedback';
  const safeMessage = (feedback.message || '').replace(/\r\n/g, '\n').replace(/\0/g, '').slice(0, 5000);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f5f5f5; padding:40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:40px 40px 20px;">
                    <h1 style="margin:0 0 8px; color:#1f2937; font-size:24px; font-weight:600;">
                      Thank You for Your Feedback
                    </h1>
                    <p style="margin:0; color:#6b7280; font-size:14px;">
                      We appreciate you taking the time
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="border-top:1px solid #e5e7eb;"></div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px 40px 20px;">
                    <p style="margin:0 0 20px; color:#1f2937; font-size:15px; line-height:1.6;">
                      Hi <strong>${feedback.name || 'there'}</strong>,
                    </p>
                    <p style="margin:0; color:#374151; font-size:15px; line-height:1.6;">
                      Thank you for sharing your thoughts with us. We've received your feedback and our team will review it carefully. Your input is valuable and helps us improve AIspire for everyone.
                    </p>
                  </td>
                </tr>

                <!-- Message Box -->
                <tr>
                  <td style="padding:0 40px 20px;">
                    <div style="background:#f9fafb; border:1px solid #e5e7eb; border-left:3px solid #1f2937; border-radius:4px; padding:20px;">
                      <div style="color:#6b7280; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
                        YOUR MESSAGE
                      </div>
                      <div style="color:#1f2937; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word;">
${safeMessage}
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Contact Info -->
                <tr>
                  <td style="padding:0 40px 30px;">
                    <p style="margin:0; color:#374151; font-size:14px; line-height:1.6;">
                      If we need additional information or have updates, we'll contact you at <a href="mailto:${feedback.email}" style="color:#2563eb; text-decoration:none;">${feedback.email}</a>.
                    </p>
                  </td>
                </tr>

                <!-- Signature -->
                <tr>
                  <td style="padding:0 40px 30px;">
                    <p style="margin:0 0 4px; color:#1f2937; font-size:15px;">
                      Best regards,
                    </p>
                    <p style="margin:0 0 4px; color:#1f2937; font-size:15px; font-weight:600;">
                      Mohan
                    </p>
                    <p style="margin:0 0 2px; color:#6b7280; font-size:14px;">
                      Founder & Developer
                    </p>
                    <p style="margin:0; color:#9ca3af; font-size:13px;">
                      AIspire · 404 Graduate
                    </p>
                  </td>
                </tr>

                <!-- Footer Links -->
                <tr>
                  <td style="padding:20px 40px 30px; text-align:center; border-top:1px solid #e5e7eb;">
                    <a href="${AIspire_url}" style="color:#1f2937; text-decoration:none; font-size:14px; font-weight:500; margin:0 12px;">Portfolio</a>
                    <a href="${AIspire_url}" style="color:#1f2937; text-decoration:none; font-size:14px; font-weight:500; margin:0 12px;">AIspire</a>
                  </td>
                </tr>

                <!-- Copyright -->
                <tr>
                  <td style="padding:0 40px 40px; text-align:center;">
                    <p style="margin:0 0 4px; color:#9ca3af; font-size:12px;">
                      AIspire · Intelligent resume & AI tools
                    </p>
                    <p style="margin:0; color:#9ca3af; font-size:12px;">
                      © ${new Date().getFullYear()} All rights reserved
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AIspire" <${process.env.SMTP_USER}>`,
      to: feedback.email,
      subject,
      html,
    });

    console.log('✓ User confirmation sent');
    return info;
  } catch (err) {
    console.error('✗ User confirmation failed:', err.message);
    throw err;
  }
};

module.exports = {
  sendFeedbackNotification,
  sendUserThankYouEmail,
};