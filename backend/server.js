require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');

const app = express();
const hf = new HfInference(process.env.HF_API_TOKEN);

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Step 1: Image Captioning
    const caption = await hf.imageToText({
      data: await (await fetch(imageUrl)).blob(),
      model: 'Salesforce/blip-image-captioning-base',
    });

    // Step 2: Generate Upcycling Ideas
    const ideasResponse = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: `Generate 3 creative upcycling ideas for: ${caption.generated_text}`,
      parameters: {
        temperature: 0.9,
        max_new_tokens: 500,
      },
    });

    // Step 3: Generate Instructions
    const instructionsResponse = await hf.textGeneration({
      model: 'google/flan-t5-xxl',
      inputs: `Create detailed step-by-step instructions for: ${ideasResponse.generated_text}`,
      parameters: {
        max_new_tokens: 1000,
      },
    });

    res.json({
      caption: caption.generated_text,
      ideas: ideasResponse.generated_text.split('\n').filter(line => line.trim()),
      instructions: instructionsResponse.generated_text.split('\n').filter(line => line.trim()),
    });

  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
