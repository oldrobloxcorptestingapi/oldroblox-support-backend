export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ZeptoMail API configuration
    const zeptoMailUrl = 'https://api.zeptomail.com/v1.1/email';
    const zeptoMailToken = process.env.ZEPTOMAIL_TOKEN;

    if (!zeptoMailToken) {
      return res.status(500).json({ error: "ZeptoMail token not configured" });
    }

    // Email payload for ZeptoMail
    const emailPayload = {
      from: {
        address: "Support@oldrobloxcorpdataconsole.work.gd",
        name: "Oldroblox Support"
      },
      to: [
        {
          email_address: {
            address: email,
            name: name
          }
        }
      ],
      subject: "Your Support Ticket Received",
      htmlbody: `
        <div style="background-color:#dfe2e5; padding:20px; font-family:Arial, sans-serif;">
          <div style="max-width:700px; margin:auto; background:#fff; border-radius:8px; padding:40px; color:#333; line-height:1.6;">
            
            <!-- Logo -->
            <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/" target="_blank">
              <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="Oldroblox Logo" style="max-width:190px;">
            </a>
            
            <!-- Message Body -->
            <p>Hi ${name},</p>
            <p>Thank you for contacting Oldroblox Support! We have received your support ticket and will get back to you shortly.</p>
            <p><strong>Your message:</strong></p>
            <p style="background-color:#f5f5f5; padding:15px; border-left:4px solid #f44336; margin:15px 0;">
              ${message.replace(/\n/g, "<br>")}
            </p>
            <p>We'll respond to your inquiry as soon as possible. Please note that our support team is available from 2PM - 10PM.</p>
            <p>For assistance in the future, please make sure to contact us here: 
              <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/support" style="color:#1155cc;">support team</a>
            </p>
            
            <p>Sincerely,<br>
            The Oldroblox Team<br>
            OldrobloxCorp</p>
            
            <!-- Footer Logo -->
            <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/" target="_blank">
              <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="Oldroblox Logo" style="max-width:140px;">
            </a>
          </div>
        </div>
      `
    };

    // Send email via ZeptoMail API
    const response = await fetch(zeptoMailUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': zeptoMailToken
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("ZeptoMail API error:", responseData);
      return res.status(500).json({ error: "Failed to send email", details: responseData });
    }

    res.status(200).json({ success: true, messageId: responseData.data?.[0]?.message_id });

  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
