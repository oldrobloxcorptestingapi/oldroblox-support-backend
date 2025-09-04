// api/send-ticket.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Nodemailer transport for Zoho
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_APP_PASSWORD
      }
    });

    // Email content
    const mailOptions = {
      from: `"Oldroblox Support" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: email, // send to user
      subject: "Your Support Ticket Received",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align:center;">
          <img src="https://oldrobloxcorpdataconsole.work.gd/oldroblox.png" alt="Oldroblox Logo" style="max-width:150px; margin-bottom:20px;">
          <h2>Thank you for contacting Oldroblox Support!</h2>
          <p>We have received your support ticket:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p>We’ll get back to you shortly.</p>
          <p>thank you for contacting support.</p>
          <p></p>
          <p></p>
          <p>THANKS</p>
          <hr>
          <p style="font-size:12px;color:#777;">OldrobloxCorp Support Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
