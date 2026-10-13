export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  if (!name || !email) {
    res.status(400).json({ ok: false, message: "Name and email are required." });
    return;
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "jadeelliefitness@gmail.com";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ||
    "Halfpenny Digital <enquiries@halfpennydigital.co.uk>";
  const key = process.env.RESEND_API_KEY;

  const rows = [
    ["Name", name],
    ["How can I help", body.help],
    ["Are you", body.gender],
    ["Age", body.age],
    ["Email", email],
    ["Phone", body.phone],
    ["Instagram", body.instagram],
    ["Contact preference", body.contact],
    ["Interested in", body.interest],
    ["What's holding them back", body.why],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  if (!key) {
    console.log("Jade enquiry (Resend not set yet)\n" + rows);
    res.status(200).json({ ok: true, queued: true });
    return;
  }

  const html = rows
    .split("\n")
    .map((line) => `<p style="font-family:Georgia,serif;font-size:15px;margin:0 0 8px;">${line}</p>`)
    .join("");

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Work with me — ${name}`,
      html,
    }),
  });

  if (!sent.ok) {
    const detail = await sent.text();
    console.error("Resend error", sent.status, detail);
    res.status(502).json({ ok: false });
    return;
  }

  res.status(200).json({ ok: true });
}
