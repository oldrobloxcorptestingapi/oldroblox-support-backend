import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Create SMTP transporter using Zoho
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_APP_PASSWORD
      }
    });

    // Send email to your inbox
    await transporter.sendMail({
      from: `"Oldroblox Support" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: "jamesberr16@gmail.com", // replace with your inbox
      subject: "New Support Ticket",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    // Optional: send confirmation to user
    await transporter.sendMail({
      from: `"Oldroblox Support" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: email,
      subject: "Your Support Ticket is Received",
      text: `Hello ${name},\n\nWe received your support ticket:\n\n${message}\n\n- Oldroblox Support`
    });

    // Respond with success
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
