import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, message, recipients } = req.body;

  if (!subject || !message || !recipients || recipients.length === 0) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Oldroblox Announcements" <no-reply@oldrobloxcorpdataconsole.work.gd>`,
      to: recipients.join(","), // multiple emails
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; color:#333;">
          <img src="https://oldrobloxcorpdataconsole.com/oldroblox.png" alt="Logo" style="max-width:170px;">
          <h2>${subject}</h2>
          <p>${message}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Sent:", info.messageId);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
