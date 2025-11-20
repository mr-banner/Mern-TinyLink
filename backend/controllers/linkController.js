const Link = require("../models/Link");
const validUrl = require("valid-url");
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createUniqueCode() {
  for (let len = 6; len <= 8; len++) {
    for (let tries = 0; tries < 20; tries++) {
      const code = generateCode(len);
      const exists = await Link.exists({ code });
      if (!exists) return code;
    }
  }
  throw new Error("Unable to generate unique code");
}

exports.createLink = async (req, res) => {
  console.log("Incoming body:", req.body);
  try {
    const { targetUrl, customCode } = req.body;
    if (!targetUrl || !validUrl.isWebUri(targetUrl)) {
      return res.status(400).json({ message: "Invalid targetUrl" });
    }

    let code;
    if (customCode) {
      if (!CODE_REGEX.test(customCode)) {
        return res
          .status(400)
          .json({ message: "Custom code must match [A-Za-z0-9]{6,8}" });
      }
      const exists = await Link.findOne({ code: customCode });
      if (exists)
        return res.status(409).json({ message: "Code already exists" });
      code = customCode;
    } else {
      code = await createUniqueCode();
    }

    const link = new Link({ code, targetUrl });
    await link
      .save()
      .then(() => console.log("Link saved successfully"))
      .catch((err) => console.log("DB SAVE ERROR:", err));
    await link.save();
    const base =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    return res.status(201).json({
      code: link.code,
      shortUrl: `${base}/${link.code}`,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClicked: link.lastClicked,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listLinks = async (req, res) => {
  try {
    const links = await Link.find({}).sort({ createdAt: -1 }).lean();
    return res.json(links);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).lean();
    if (!link) return res.status(404).json({ message: "Not found" });
    return res.json(link);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const deleted = await Link.findOneAndDelete({ code });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
