const Url = require('../models/url');


function calculateExpiry(validity) {
  const days = parseInt(validity, 10);
  const expireAt = new Date();
  expireAt.setDate(expireAt.getDate() + days);
  return expireAt;
}


exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;
    if (!url || !validity || !shortcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const expireAt = calculateExpiry(validity);
    const newUrl = new Url({ longUrl: url, shortString: shortcode, expireAt });
    await newUrl.save();
    res.status(201).json({
      shortlink: `http://localhost:3000/${shortcode}`,
      expiry: expireAt
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectToLongUrl = async (req, res) => {
  try {
    const { shortString } = req.params;
    const url = await Url.findOne({ shortString });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (url.expireAt < new Date()) {
      return res.status(410).json({ error: 'Short URL expired' });
    }
    // Track click
    const source = req.get('Referer') || 'direct';
    const geo = req.headers['x-geo-location'] || 'unknown';
    url.clicks.push({ source, geo });
    url.clickCount += 1;
    await url.save();
    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getShortUrlAnalytics = async (req, res) => {
  try {
    const { shortString } = req.params;
    const url = await Url.findOne({ shortString });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({
      originalUrl: url.longUrl,
      clickCount: url.clickCount,
      clicks: url.clicks.map(click => ({
        timestamp: click.timestamp,
        source: click.source,
        geo: click.geo
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 