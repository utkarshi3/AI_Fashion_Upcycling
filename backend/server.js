import express from 'express';
import { HfInference } from '@huggingface/inference';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const hf = new HfInference(process.env.HF_API_TOKEN);

app.use(cors());
app.use(express.json());

// Image Analysis Endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Step 1: Image Captioning with BLIP
    const caption = await hf.imageToText({
      data: await (await fetch(imageUrl)).blob(),
      model: 'Salesforce/blip-image-captioning-base'
    });

    // Step 2: Generate Upcycling Ideas
    const ideas = await hf.textGeneration({
      inputs: `Generate 3 creative upcycling ideas for: ${caption.generated_text}`,
      parameters: {
        temperature: 0.9,
        max_new_tokens: 500
      }
    });

    // Step 3: Generate Instructions
    const instructions = await hf.textGeneration({
      inputs: `Create step-by-step instructions for: ${ideas.generated_text}`,
      parameters: { max_new_tokens: 1000 }
    });

    res.json({
      caption: caption.generated_text,
      ideas: ideas.generated_text.split('\n').filter(Boolean),
      instructions: instructions.generated_text.split('\n')
    });

  } catch (error) {
    res.status(500).json({ error: 'AI processing failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
