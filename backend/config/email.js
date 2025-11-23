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

// Admin notification email
const sendFeedbackNotification = async (feedback) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!ADMIN_EMAIL) {
    console.warn('⚠️ ADMIN_EMAIL not set, skipping feedback notification.');
    return;
  }

  const subject = `New ${feedback.type || 'feedback'} from ${feedback.name || 'Anonymous'}`;
  const type = (feedback.type || 'other').toLowerCase();

  const typeLabelMap = {
    bug: 'Bug Report',
    feature: 'Feature Request',
    suggestion: 'General Suggestion',
    other: 'Other',
  };

  const typeLabel = typeLabelMap[type] || 'Feedback';

  const badgeStyleMap = {
    bug: 'background:#fee2e2; color:#991b1b;',
    feature: 'background:#dcfce7; color:#166534;',
    suggestion: 'background:#dbeafe; color:#1e40af;',
    other: 'background:#f3f4f6; color:#374151;',
  };

  const badgeStyle = badgeStyleMap[type] || badgeStyleMap.other;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb; padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
                
                <!-- Header -->
                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    <h1 style="margin:0 0 8px 0; color:#111827; font-size:26px; font-weight:700; letter-spacing:-0.5px;">
                      New Feedback Received
                    </h1>
                    <p style="margin:0; color:#6b7280; font-size:14px; font-weight:500;">
                      AIspire Platform Notification
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px; background:#e5e7eb;"></div>
                  </td>
                </tr>

                <!-- Type Badge -->
                <tr>
                  <td style="padding:24px 40px;">
                    <span style="${badgeStyle} padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; letter-spacing:0.3px; display:inline-block;">
                      ${typeLabel}
                    </span>
                  </td>
                </tr>

                <!-- Contact Information -->
                <tr>
                  <td style="padding:0 40px 24px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:16px 0;">
                          <table width="100%" cellpadding="8" cellspacing="0" border="0">
                            <tr>
                              <td width="120" style="color:#6b7280; font-size:14px; font-weight:600; padding:8px 0;">
                                Name
                              </td>
                              <td style="color:#111827; font-size:14px; font-weight:500; padding:8px 0;">
                                ${feedback.name || 'Anonymous'}
                              </td>
                            </tr>
                            <tr>
                              <td style="color:#6b7280; font-size:14px; font-weight:600; padding:8px 0;">
                                Email
                              </td>
                              <td style="color:#111827; font-size:14px; font-weight:500; padding:8px 0;">
                                ${feedback.email ? `<a href="mailto:${feedback.email}" style="color:#2563eb; text-decoration:none;">${feedback.email}</a>` : 'Not provided'}
                              </td>
                            </tr>
                            <tr>
                              <td style="color:#6b7280; font-size:14px; font-weight:600; padding:8px 0;">
                                User ID
                              </td>
                              <td style="color:#111827; font-size:14px; font-weight:500; padding:8px 0;">
                                ${feedback.userId || 'Guest User'}
                              </td>
                            </tr>
                            <tr>
                              <td style="color:#6b7280; font-size:14px; font-weight:600; padding:8px 0; vertical-align:top;">
                                Page URL
                              </td>
                              <td style="color:#111827; font-size:14px; font-weight:500; padding:8px 0; word-break:break-all;">
                                ${feedback.pageUrl ? `<a href="${feedback.pageUrl}" style="color:#2563eb; text-decoration:none;" target="_blank">${feedback.pageUrl}</a>` : 'Not provided'}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="padding:0 40px 32px 40px;">
                    <div style="background:#f9fafb; border-radius:8px; padding:20px; border-left:3px solid #111827;">
                      <p style="margin:0 0 8px 0; color:#6b7280; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">
                        Message
                      </p>
                      <div style="color:#374151; font-size:14px; line-height:1.7; white-space:pre-wrap;">${feedback.message}</div>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb;">
                    <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center; line-height:1.6;">
                      AIspire · Automated notification<br>
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

  await transporter.sendMail({
    from: `"AIspire Notifications" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
};

// User thank-you email
const sendUserThankYouEmail = async (feedback) => {
  if (!feedback.email) {
    console.warn('⚠️ No user email provided, skipping user thank-you email.');
    return;
  }

  const subject = 'Thank you for your feedback on AIspire';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb; padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
                
                <!-- Header -->
                <tr>
                  <td style="padding:40px 40px 32px 40px;">
                    <h1 style="margin:0 0 8px 0; color:#111827; font-size:26px; font-weight:700; letter-spacing:-0.5px;">
                      Thank You for Your Feedback
                    </h1>
                    <p style="margin:0; color:#6b7280; font-size:14px; font-weight:500;">
                      We appreciate you taking the time
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <div style="height:1px; background:#e5e7eb;"></div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:32px 40px;">
                    <p style="margin:0 0 20px 0; color:#374151; font-size:15px; line-height:1.6;">
                      Hi <strong style="color:#111827;">${feedback.name || 'there'}</strong>,
                    </p>
                    <p style="margin:0 0 24px 0; color:#4b5563; font-size:14px; line-height:1.7;">
                      Thank you for sharing your thoughts with us. We've received your feedback and our team will review it carefully. Your input is valuable and helps us improve AIspire for everyone.
                    </p>

                    <!-- Feedback Summary -->
                    <div style="background:#f9fafb; border-radius:8px; padding:20px; margin-bottom:24px; border-left:3px solid #111827;">
                      <p style="margin:0 0 8px 0; color:#6b7280; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">
                        Your Message
                      </p>
                      <div style="color:#374151; font-size:14px; line-height:1.7; white-space:pre-wrap;">${feedback.message}</div>
                    </div>

                    <p style="margin:0 0 24px 0; color:#4b5563; font-size:14px; line-height:1.7;">
                      If we need additional information or have updates, we'll contact you at <strong style="color:#111827;">${feedback.email}</strong>.
                    </p>

                    <!-- Signature -->
                    <div style="margin-top:32px; padding-top:24px; border-top:1px solid #e5e7eb;">
                      <p style="margin:0; color:#374151; font-size:14px; line-height:1.6;">
                        Best regards,
                      </p>
                      <p style="margin:8px 0 0 0; color:#111827; font-size:15px; font-weight:600; line-height:1.5;">
                        Mohan<br>
                        <span style="color:#6b7280; font-size:13px; font-weight:500;">Founder & Developer</span><br>
                        <span style="color:#9ca3af; font-size:12px; font-weight:400;">AIspire · 404 Graduate</span>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb; padding:24px 40px; border-top:1px solid #e5e7eb;">
                    <div style="text-align:center; margin-bottom:12px;">
                      <a href="https://your-portfolio-url.com" style="color:#111827; text-decoration:none; font-size:13px; font-weight:500; margin:0 12px;">Portfolio</a>
                      <span style="color:#d1d5db;">·</span>
                      <a href=${AIspire_url} style="color:#111827; text-decoration:none; font-size:13px; font-weight:500; margin:0 12px;">AIspire</a>
                    </div>
                    <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center; line-height:1.6;">
                      AIspire · Intelligent resume & AI tools<br>
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

  await transporter.sendMail({
    from: `"AIspire" <${process.env.SMTP_USER}>`,
    to: feedback.email,
    subject,
    html,
  });
};

module.exports = {
  sendFeedbackNotification,
  sendUserThankYouEmail,
};