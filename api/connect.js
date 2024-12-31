const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await axios.post('https://discord.com/api/v9/gateway/bot', {}, {
      headers: {
        Authorization: `Bot ${token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to Discord' });
  }
};
