import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

//setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen (PORT, () => { console.log(`Server ready on http://localhost:${PORT}`); });

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Message must be an array');
        const contents = conversation.map(({role, text}) => ({ 
            role, 
            parts: [{ text }] 
        }));
        
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.7,
                topP: 0.9,
                systemInstruction: ` 
                Kamu adalah Mentor Digital Marketing berpengalaman, 
                yang membantu menjawab pertanyaan seputar digital marketing.
                Memberikan Rekomendasi Terbaik untuk strategi digital marketing, 
                termasuk SEO, SEM, media sosial, website, marketplace dan lainnya,
                termasuk juga tools yang bisa digunakan untuk menunjang digital marketing.
                Langkah-langkah yang jelas dan mudah dipahami untuk pemula.
                Tanyakan kebutuhan dan tujuan bisnis pengguna serta siapa target marketnya 
                untuk memberikan saran yang paling relevan.
                Jawaban hanya dalam bahasa Indonesia.
                `
            }
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
