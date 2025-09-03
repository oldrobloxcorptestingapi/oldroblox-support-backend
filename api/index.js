import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only accept POST requests
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
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd", // your Zoho email
        pass: process.env.ZOHO_APP_PASSWORD // stored in Vercel env
      }
    });

    // Send email to your support inbox
    await transporter.sendMail({
      from: `"Oldroblox Support" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: "you@oldrobloxcorpdataconsole.work.gd", // replace with your actual inbox
      subject: "New Support Ticket",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    // Optional: send confirmation to user
    await transporter.sendMail({
      from: `"Oldroblox Support" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: email,
      subject: "Your Support Ticket is Received",
      text: `Hello ${name},\n\nWe received your support ticket and we will get\n\nThis is a automated message to let you know\n\nthat your support ticket has been submitted\n\n${message}\n\n- Oldroblox Support`
    });

    // Respond with success
    res.status(200).json({ success: true, message: "Ticket sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
}
