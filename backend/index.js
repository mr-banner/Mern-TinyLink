require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const linksRouter = require('./routes/links');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/healthz', (req, res) => {
  return res.status(200).json({ message:"Api working fine!!!" });
});
app.use('/api/links', linksRouter);
const Link = require('./models/Link');
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) {
      return res.status(404).send('Not found');
    }
    link.totalClicks = (link.totalClicks || 0) + 1;
    link.lastClicked = new Date();
    await link.save();
    return res.redirect(302, link.targetUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});
const PORT = process.env.PORT || 4000;
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server listening ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
