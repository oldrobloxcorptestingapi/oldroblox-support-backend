import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // ⚠️ replace * with your frontend domain in production
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { recipients } = req.body;

    // Validate inputs
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: "Missing or invalid recipients" });
    }

    // Full email content (plain text and HTML)
    const message = `Hi there,

Thank you for contacting us.
We'll review your ticket later to see if we can help with that issue.
Until then, please wait for a message from our team.

This message is automated, so please do not reply unless an employee emails you.`;

    const formattedHtmlMessage = message.replace(/\n/g, "<br>");

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_PASS // Set this in Vercel Environment Variables
      }
    });

    await transporter.sendMail({
      from: '"OldrobloxCorp" <no-reply@oldrobloxcorpdataconsole.work.gd>',
      to: recipients.join(","),
      subject: "License Request Confirmation",
      text: message,
      html: `
        <div style="background-color:#dfe2e5; padding:20px; font-family:Arial, sans-serif;">
          <div style="max-width:700px; margin:auto; background:#fff; border-radius:8px; padding:40px; color:#333; line-height:1.6;">
            
            <!-- Logo -->
            <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/" target="_blank">
              <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="Oldroblox Logo" style="max-width:190px;">
            </a>

            <!-- Message Body -->
            <p>Hi there,</p>
            <p>${formattedHtmlMessage}</p>

            <p>For assistance in the future, please make sure to contact us here: 
              <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/support" style="color:#1155cc;">support team</a>
            </p>
            
            <p>Sincerely,<br>
            The Oldroblox Support Team<br>
            OldrobloxCorp</p>

            <!-- Footer Logo -->
            <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/" target="_blank">
              <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="Oldroblox Logo" style="max-width:140px;">
            </a>
          </div>
        </div>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
  }
}
