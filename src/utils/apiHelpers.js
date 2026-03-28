import { SYSTEM_PROMPT_ENHANCE, SYSTEM_PROMPT_ANALYZE_IMAGE } from './constants';

const OPENAI_API_URL = 'https://api.openai.com/v1';
const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
};

export const getEnhancedPrompt = async (input) => {
  if (!OPENAI_KEY) {
    return `${input} in crisp detail with rich lighting, cinematic atmosphere, and polished style.`;
  }

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_ENHANCE },
      { role: 'user', content: input }
    ],
    temperature: 0.85,
    max_tokens: 220
  };

  const data = await safeFetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }
  return `${input} with enhanced lighting, styling, and composition.`;
};

export const analyzeImage = async (base64Image) => {
  if (!OPENAI_KEY) {
    return {
      mainObjects: 'Landscape with a central subject',
      colorPalette: 'soft blue, warm gold, and muted greens',
      artisticStyle: 'dreamy digital painting',
      mood: 'cinematic and calm'
    };
  }

  const text = `${SYSTEM_PROMPT_ANALYZE_IMAGE}\n
Image data: ${base64Image}`;
  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: text }
    ],
    temperature: 0.7,
    max_tokens: 240
  };

  const data = await safeFetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!data?.choices?.[0]?.message?.content) {
    return null;
  }

  const textResponse = data.choices[0].message.content;
  try {
    const json = JSON.parse(textResponse);
    return {
      mainObjects: json.mainObjects || 'unknown objects',
      colorPalette: json.colorPalette || 'balanced colors',
      artisticStyle: json.artisticStyle || 'modern digital art',
      mood: json.mood || 'neutral'
    };
  } catch {
    const lines = textResponse.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const result = {};
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        const normalized = key.toLowerCase().replace(/\s+/g, '');
        if (normalized.includes('main')) result.mainObjects = value.trim();
        if (normalized.includes('color')) result.colorPalette = value.trim();
        if (normalized.includes('style')) result.artisticStyle = value.trim();
        if (normalized.includes('mood')) result.mood = value.trim();
      }
    });
    return {
      mainObjects: result.mainObjects || 'scene description',
      colorPalette: result.colorPalette || 'rich palette',
      artisticStyle: result.artisticStyle || 'stylized art',
      mood: result.mood || 'electric'
    };
  }
};

export const generateImage = async (prompt) => {
  if (!OPENAI_KEY) {
    return 'https://via.placeholder.com/1024x640.png?text=AI+Image+Placeholder';
  }

  const payload = {
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024'
  };

  const data = await safeFetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (data?.data?.[0]?.b64_json) {
    return `data:image/png;base64,${data.data[0].b64_json}`;
  }
  if (data?.data?.[0]?.url) {
    return data.data[0].url;
  }
  return null;
};
