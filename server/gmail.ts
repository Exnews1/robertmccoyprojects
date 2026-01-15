import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  organization?: string | null;
  inquiryType: string;
  message: string;
}) {
  try {
    const gmail = await getUncachableGmailClient();
    
    const notificationEmail = 'mccoyaerospace@gmail.com';
    
    const emailContent = [
      `From: CMGF Portfolio <${notificationEmail}>`,
      `To: ${notificationEmail}`,
      `Subject: New CMGF Inquiry: ${inquiry.inquiryType}`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      `<html>
<body style="font-family: Arial, sans-serif; color: #333;">
<h2 style="color: #1a365d;">New Inquiry Received</h2>
<p>A new inquiry has been submitted through the CMGF Portfolio website.</p>
<hr style="border: 1px solid #e2e8f0;">
<p><strong>Name:</strong> ${inquiry.name}</p>
<p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
<p><strong>Organization:</strong> ${inquiry.organization || 'Not provided'}</p>
<p><strong>Inquiry Type:</strong> ${inquiry.inquiryType}</p>
<hr style="border: 1px solid #e2e8f0;">
<h3>Message:</h3>
<p style="background: #f7fafc; padding: 15px; border-radius: 4px;">${inquiry.message.replace(/\n/g, '<br>')}</p>
<hr style="border: 1px solid #e2e8f0;">
<p style="color: #718096; font-size: 12px;">This notification was sent from robertmccoyprojects.com</p>
</body>
</html>`
    ].join('\n');

    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log('Inquiry notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send inquiry notification:', error);
    return false;
  }
}
