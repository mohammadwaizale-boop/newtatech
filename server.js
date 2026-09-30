// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
var LINKED_COMPANY_EMAILS = [
  "mohammadwaizale@gmail.com",
  "awanareeb450@gmail.com"
];
function getLinkedRecipients() {
  const fileConfig = loadConfig();
  const configured = fileConfig.company_email || process.env.COMPANY_EMAIL || "";
  const list = new Set(LINKED_COMPANY_EMAILS);
  if (configured) {
    configured.split(/[,;\s]+/).map((e) => e.trim().toLowerCase()).filter((e) => e && e.includes("@")).forEach((e) => list.add(e));
  }
  return Array.from(list);
}
process.env.COMPANY_EMAIL = LINKED_COMPANY_EMAILS.join(", ");
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var port = parseInt(process.env.PORT || "3000", 10);
app.use(express.json());
var CONFIG_PATH = path.join(__dirname, "smtp.config.json");
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[Config] Failed to read smtp.config.json:", err);
  }
  return {};
}
function saveConfig(updates) {
  const current = loadConfig();
  const next = { ...current, ...updates };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), "utf-8");
  } catch (err) {
    console.error("[Config] Failed to save smtp.config.json:", err);
  }
  return next;
}
var activeTransporter = null;
var activeProviderInfo = null;
async function getTransporter(forceRefresh = false) {
  const fileConfig = loadConfig();
  const linkedRecipients = getLinkedRecipients();
  const companyEmail = linkedRecipients.join(", ");
  if (activeTransporter && !forceRefresh && activeProviderInfo) {
    activeProviderInfo.recipient = companyEmail;
    return { transporter: activeTransporter, info: activeProviderInfo };
  }
  const host = process.env.SMTP_HOST || fileConfig.smtp_host || "";
  const port2 = parseInt(String(process.env.SMTP_PORT || fileConfig.smtp_port || 587), 10);
  const user = process.env.SMTP_USER || fileConfig.smtp_user || "";
  const pass = process.env.SMTP_PASS || fileConfig.smtp_pass || "";
  const secure = port2 === 465 || Boolean(fileConfig.smtp_secure);
  const senderEmail = process.env.SENDER_EMAIL || fileConfig.sender_email || user || "mohammadwaizale@gmail.com";
  const senderName = fileConfig.sender_name || "Newta Tech Platform";
  if (host && user && pass) {
    console.log(`[Email Service] Initializing production SMTP transport: ${host}:${port2} (${user})`);
    const transporter2 = nodemailer.createTransport({
      host,
      port: port2,
      secure,
      auth: { user, pass },
      // Strict connection timeout
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      socketTimeout: 15e3
    });
    await transporter2.verify();
    console.log("[Email Service] Production SMTP handshake verified successfully.");
    activeTransporter = transporter2;
    activeProviderInfo = {
      mode: "real_smtp",
      host,
      port: port2,
      user,
      recipient: companyEmail,
      sender: `"${senderName}" <${senderEmail}>`
    };
    return { transporter: transporter2, info: activeProviderInfo };
  }
  console.log("[Email Service] No production SMTP user/pass configured. Initializing Ethereal delivery sandbox...");
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  activeTransporter = transporter;
  activeProviderInfo = {
    mode: "ethereal_sandbox",
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    user: testAccount.user,
    recipient: companyEmail,
    sender: `"${senderName}" <${senderEmail}>`
  };
  return { transporter, info: activeProviderInfo };
}
app.get("/api/smtp/status", async (req, res) => {
  try {
    const config = loadConfig();
    const linkedRecipients = getLinkedRecipients();
    const smtpHost = process.env.SMTP_HOST || config.smtp_host || "smtp.gmail.com";
    const smtpPort = process.env.SMTP_PORT || config.smtp_port || 587;
    const hasUser = Boolean(process.env.SMTP_USER || config.smtp_user);
    const hasPass = Boolean(process.env.SMTP_PASS || config.smtp_pass);
    const configuredUser = process.env.SMTP_USER || config.smtp_user || "";
    return res.status(200).json({
      success: true,
      recipient: linkedRecipients.join(", "),
      recipients: linkedRecipients,
      isLinked: true,
      smtp: {
        host: smtpHost,
        port: smtpPort,
        configuredUser: hasUser ? configuredUser : null,
        hasPasswordConfigured: hasPass,
        mode: hasUser && hasPass ? "production_smtp" : "test_sandbox"
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/smtp/configure", async (req, res) => {
  try {
    const { smtp_host, smtp_port, smtp_user, smtp_pass, company_email, sender_name } = req.body;
    const updates = {};
    if (smtp_host) updates.smtp_host = String(smtp_host).trim();
    if (smtp_port) updates.smtp_port = parseInt(String(smtp_port), 10);
    if (smtp_user) updates.smtp_user = String(smtp_user).trim();
    if (smtp_pass) updates.smtp_pass = String(smtp_pass).trim();
    if (company_email) {
      const inputList = String(company_email).split(/[,;\s]+/).map((e) => e.trim().toLowerCase()).filter((e) => e && e.includes("@"));
      const merged = Array.from(/* @__PURE__ */ new Set([...LINKED_COMPANY_EMAILS, ...inputList]));
      updates.company_email = merged.join(", ");
    }
    if (sender_name) updates.sender_name = String(sender_name).trim();
    saveConfig(updates);
    activeTransporter = null;
    activeProviderInfo = null;
    try {
      const { info } = await getTransporter(true);
      return res.status(200).json({
        success: true,
        message: "SMTP settings updated and verified successfully.",
        provider: info
      });
    } catch (verifyErr) {
      return res.status(400).json({
        success: false,
        error: `Credentials saved, but SMTP verification failed: ${verifyErr.message}`,
        details: verifyErr.code || verifyErr.response || null
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/smtp/test", async (req, res) => {
  try {
    const { transporter, info } = await getTransporter(false);
    const recipients = getLinkedRecipients();
    const timestamp = (/* @__PURE__ */ new Date()).toUTCString();
    console.log(`[Email Service] Dispatching diagnostic test email to linked inboxes: ${recipients.join(", ")}...`);
    const mailOptions = {
      from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
      to: recipients,
      subject: `[Diagnostic Test] Newta Tech Mail Verification for ${recipients.join(" & ")} \u2014 ${(/* @__PURE__ */ new Date()).toISOString()}`,
      text: `NEWTA TECH SMTP VERIFICATION TEST
=========================================
Linked Inboxes:
${recipients.map((r) => `- ${r}`).join("\n")}

SMTP Host: ${info?.host}:${info?.port}
Active Mode: ${info?.mode}
Timestamp: ${timestamp}

This is a live diagnostic verification email confirming that the Newta Tech pipeline is actively transmitting to both linked accounts:
1. mohammadwaizale@gmail.com
2. awanareeb450@gmail.com
`,
      html: `
<div style="background:#003135;color:#FFFFFF;padding:24px;font-family:sans-serif;border-radius:16px;max-width:560px;border:1px solid #0FA4AF;">
  <h2 style="color:#AFDDE5;margin-top:0;">Newta Tech // SMTP Diagnostic Verification</h2>
  <p style="font-size:14px;color:#AFDDE5;">Both email accounts are linked. Inquiries and tests are delivered simultaneously to both accounts:</p>
  <div style="background:#024045;padding:16px;border-radius:10px;font-family:monospace;font-size:12px;margin:16px 0;border:1px solid rgba(15,164,175,0.4);">
    <div style="margin-bottom:6px;">LINKED INBOX 1: <strong style="color:#FFFFFF;">mohammadwaizale@gmail.com</strong></div>
    <div style="margin-bottom:6px;">LINKED INBOX 2: <strong style="color:#FFFFFF;">awanareeb450@gmail.com</strong></div>
    <div style="margin-bottom:6px;">SMTP GATEWAY: <strong style="color:#AFDDE5;">${info?.host}:${info?.port}</strong></div>
    <div>ACTIVE MODE: <strong style="color:#34D399;">${info?.mode}</strong></div>
  </div>
  <p style="font-size:12px;color:#AFDDE5;">Both accounts are verified and linked to receive client inquiries.</p>
</div>
`
    };
    const sendResult = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Diagnostic test email accepted by mail server for ${recipients.join(", ")}:`, sendResult.messageId);
    return res.status(200).json({
      success: true,
      message: `Test email successfully dispatched to both linked accounts: ${recipients.join(" and ")}.`,
      result: {
        recipient: recipients.join(", "),
        recipients,
        messageId: sendResult.messageId,
        accepted: sendResult.accepted,
        rejected: sendResult.rejected,
        mode: info?.mode,
        previewUrl: nodemailer.getTestMessageUrl(sendResult) || null
      }
    });
  } catch (err) {
    console.error("[Email Service] Diagnostic test failed:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
      code: err.code || null,
      command: err.command || null,
      response: err.response || null
    });
  }
});
app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, email, company, projectType, budgetRange, description } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Customer name is required." });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return res.status(400).json({ success: false, error: "Project description must be at least 10 characters." });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCompany = company && typeof company === "string" && company.trim() ? company.trim() : "Not Specified";
    const cleanProjectType = projectType && typeof projectType === "string" ? projectType.trim() : "AI Solution";
    const cleanBudget = budgetRange && typeof budgetRange === "string" ? budgetRange.trim() : "Not Specified";
    const cleanDescription = description.trim();
    const submissionDate = (/* @__PURE__ */ new Date()).toUTCString();
    const { transporter, info } = await getTransporter(false);
    const recipientList = getLinkedRecipients();
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #003135; color: #FFFFFF; padding: 24px; margin: 0; }
    .card { max-width: 620px; margin: 0 auto; background-color: #024045; border: 1px solid #0FA4AF; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0FA4AF 0%, #003135 100%); padding: 24px; text-align: left; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #AFDDE5; font-size: 12px; font-family: monospace; }
    .linked-banner { background-color: #003135; border-bottom: 1px solid rgba(15,164,175,0.4); padding: 12px 24px; font-size: 11px; font-family: monospace; color: #AFDDE5; }
    .linked-banner strong { color: #FFFFFF; }
    .content { padding: 24px; }
    .field { margin-bottom: 18px; border-bottom: 1px solid rgba(175,221,229,0.15); padding-bottom: 12px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 11px; text-transform: uppercase; color: #AFDDE5; font-family: monospace; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: bold; }
    .value { font-size: 14px; color: #FFFFFF; font-weight: 500; }
    .desc-box { background-color: #003135; border: 1px solid rgba(15,164,175,0.4); border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap; }
    .footer { padding: 16px 24px; background-color: #002528; border-top: 1px solid rgba(15,164,175,0.3); font-size: 11px; color: #AFDDE5; font-family: monospace; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; background: rgba(15, 164, 175, 0.25); color: #AFDDE5; font-size: 12px; font-family: monospace; border: 1px solid #0FA4AF; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Newta Tech // New Project Inquiry</h1>
      <p>SOURCE: NEWTA TECH PORTAL INGESTION</p>
    </div>
    <div class="linked-banner">
      \u{1F517} LINKED INBOXES (Both Delivered): <strong>${recipientList.join(" & ")}</strong>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Customer Name</div>
        <div class="value">${cleanName}</div>
      </div>
      <div class="field">
        <div class="label">Customer Email (Click to reply)</div>
        <div class="value"><a href="mailto:${cleanEmail}" style="color: #AFDDE5; text-decoration: underline; font-weight: bold;">${cleanEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Company / Organization</div>
        <div class="value">${cleanCompany}</div>
      </div>
      <div class="field">
        <div class="label">Project Type</div>
        <div class="value"><span class="badge">${cleanProjectType}</span></div>
      </div>
      <div class="field">
        <div class="label">Anticipated Budget</div>
        <div class="value">${cleanBudget}</div>
      </div>
      <div class="field">
        <div class="label">Submission Timestamp</div>
        <div class="value" style="font-family: monospace; font-size: 12px; color: #AFDDE5;">${submissionDate}</div>
      </div>
      <div class="field">
        <div class="label">Project Requirements &amp; Description</div>
        <div class="desc-box">${cleanDescription}</div>
      </div>
    </div>
    <div class="footer">
      <span>NEWTA TECH LINKED DISPATCH</span>
      <span>REPLY-TO: ${cleanEmail}</span>
    </div>
  </div>
</body>
</html>
`;
    const plainText = `
NEW NEWTA TECH PROJECT INQUIRY
=========================================
LINKED INBOXES (Both Receive This Message):
${recipientList.map((r) => `- ${r}`).join("\n")}

CUSTOMER DETAILS:
-----------------------------------------
Customer Name: ${cleanName}
Customer Email: ${cleanEmail}
Company / Organization: ${cleanCompany}
Project Type: ${cleanProjectType}
Budget: ${cleanBudget}
Submission Date/Time: ${submissionDate}

PROJECT DESCRIPTION:
-----------------------------------------
${cleanDescription}

=========================================
Reply directly to this email to respond to ${cleanName} (${cleanEmail}).
`;
    console.log(`[Email Service] Dispatching linked inquiry to both accounts: ${recipientList.join(", ")}...`);
    const mailOptions = {
      from: info?.sender || `"Newta Tech Platform" <mohammadwaizale@gmail.com>`,
      to: recipientList,
      // Sends to BOTH mohammadwaizale@gmail.com and awanareeb450@gmail.com
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `New Newta Tech Project Inquiry \u2014 ${cleanName} (${cleanCompany})`,
      text: plainText,
      html: htmlContent
    };
    const sendResult = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Delivered successfully to linked inboxes ${recipientList.join(", ")}: ${sendResult.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(sendResult) || null;
    return res.status(200).json({
      success: true,
      message: `Inquiry received and delivered to linked company inboxes (${recipientList.join(", ")}).`,
      deliveryDetails: {
        recipient: recipientList.join(", "),
        recipients: recipientList,
        messageId: sendResult.messageId,
        timestamp: submissionDate,
        mode: info?.mode,
        previewUrl,
        accepted: sendResult.accepted,
        rejected: sendResult.rejected
      }
    });
  } catch (error) {
    console.error("[Email Service] Failed to send customer inquiry email:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to dispatch email via mail server. Please try again shortly.",
      code: error?.code || null,
      details: error?.response || null
    });
  }
});
async function startServer() {
  const distPath = path.join(__dirname, "dist");
  const distIndex = path.join(distPath, "index.html");
  const hasDist = fs.existsSync(distIndex);
  if (process.env.NODE_ENV === "production" || hasDist) {
    console.log(`[Nexa Server] Serving production static assets from ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (fs.existsSync(distIndex)) {
        res.sendFile(distIndex);
      } else {
        res.status(200).send("<!DOCTYPE html><html><head><title>Nexa Tech</title></head><body><h1>Nexa Tech Server Active</h1></body></html>");
      }
    });
  } else {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn("[Nexa Server] Vite middleware unavailable in this environment, falling back to static/API mode:", viteErr);
    }
  }
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[Nexa Server] Running on http://0.0.0.0:${port} (PORT=${port})`);
    console.log(`[Nexa Server] Target Recipients: mohammadwaizale@gmail.com, awanareeb450@gmail.com`);
  });
  server.on("error", (err) => {
    console.error("[Nexa Server] Fatal server error:", err);
  });
}
startServer();
export {
  LINKED_COMPANY_EMAILS
};
