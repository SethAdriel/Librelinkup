import express from 'express';
import cors from 'cors';
import { LibreLinkUpClient } from '@diakem/libre-link-up-api-client';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post('/get-glucose', async (req, res) => {
  // Step 1: Fallback credentials
  const username = req.body.username || 'yashasviseth8@gmail.com';
  const password = req.body.password || 'Jesus@123';

  try {
    // Step 2: Setup LibreLink client
    const { read } = LibreLinkUpClient({
      username,
      password,
      clientVersion: '4.9.0'
    });

    // Step 3: Read data
    const data = await read();

    // Step 4: Check and respond
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No glucose data found',
      });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error fetching LibreLink data:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Optional GET route for browser check
app.get('/', (req, res) => {
  res.send('✅ LibreLinkUp API backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
