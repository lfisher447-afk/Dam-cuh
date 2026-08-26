import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

export default client;
