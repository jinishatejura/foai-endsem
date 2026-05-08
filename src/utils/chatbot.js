/**
 * AI Chatbot utility using Hugging Face Inference API
 * Model: mistralai/Mistral-7B-Instruct-v0.2
 * Constrained to only answer from dashboard data (ISS + News)
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

/**
 * Build the context string from dashboard data
 */
export function buildContext(issData, newsData) {
  let context = '';

  // ISS Data
  if (issData) {
    context += `=== ISS (International Space Station) Data ===\n`;
    context += `Current Latitude: ${issData.latitude}\n`;
    context += `Current Longitude: ${issData.longitude}\n`;
    context += `Current Speed: ${issData.speed ? issData.speed.toFixed(1) + ' km/h' : 'Calculating...'}\n`;
    context += `Current Location: ${issData.locationName || 'Unknown'}\n`;
    context += `Positions Tracked: ${issData.positionCount || 0}\n`;

    if (issData.astronauts && issData.astronauts.length > 0) {
      context += `\nPeople in Space: ${issData.astronauts.length}\n`;
      context += `Astronaut Names:\n`;
      issData.astronauts.forEach((a) => {
        context += `- ${a.name} (${a.craft})\n`;
      });
    }
  }

  // News Data
  if (newsData && newsData.length > 0) {
    context += `\n=== News Articles (${newsData.length} total) ===\n`;
    newsData.forEach((article, i) => {
      context += `\nArticle ${i + 1}:\n`;
      context += `Title: ${article.title}\n`;
      context += `Source: ${article.source_name || article.source_id || 'Unknown'}\n`;
      context += `Category: ${article.category ? article.category.join(', ') : 'General'}\n`;
      context += `Date: ${article.pubDate || 'Unknown'}\n`;
      context += `Description: ${article.description || 'No description'}\n`;
    });
  }

  return context;
}

/**
 * Send a message to the chatbot
 */
export async function sendMessage(userMessage, issData, newsData) {
  if (!HF_TOKEN) {
    return "Error: Hugging Face API token is not configured. Please set VITE_AI_TOKEN in your .env file.";
  }

  const context = buildContext(issData, newsData);

  const systemPrompt = `You are an AI assistant for an ISS & News Dashboard application. You can ONLY answer questions using the dashboard data provided below. Do NOT use any external knowledge or make up information. If the user asks something not covered by the data, say "I can only answer questions about the ISS tracking data and news articles currently shown on the dashboard."

Be concise, helpful, and friendly. Format numbers nicely. If asked about the ISS, use the ISS data. If asked about news, use the news articles data.`;

  const prompt = `<s>[INST] ${systemPrompt}\n\n--- DASHBOARD DATA ---\n${context}\n--- END DATA ---\n\nUser question: ${userMessage} [/INST]`;

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.3,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503) {
        return "The AI model is currently loading. Please try again in a few seconds.";
      }
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text.trim();
    }

    return "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Chatbot error:', error);
    if (error.message.includes('Failed to fetch')) {
      return "Network error. Please check your internet connection.";
    }
    return `Error: ${error.message}`;
  }
}
