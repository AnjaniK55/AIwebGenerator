const { Anthropic } = require("@anthropic-ai/sdk");

const generateWebsiteStructure = async (projectName, businessType, description, websiteGoal, prompt) => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("Anthropic API Key (CLAUDE_API_KEY) is not configured on the backend environment.");
  }

  const anthropic = new Anthropic({
    apiKey,
  });

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

  const systemPrompt = `You are a premium AI website planner and system architect.
Your task is to analyze user business descriptions and goals, and output a structured website layout configuration.

You MUST respond with a single valid JSON object ONLY. Do NOT write any conversational text, explanations, or preambles.
The JSON payload must strictly follow this schema:
{
  "websiteName": "A premium title for the website",
  "industry": "Specific target business niche",
  "style": "Visual aesthetic style name (e.g. Modern Minimalist, Obsidian Dark Mode)",
  "pages": [
    {
      "name": "Page Name (e.g. Home, Services, Contact)",
      "sections": [
        "Description of layout component section (e.g. Sticky glassmorphic navbar with logo)"
      ]
    }
  ],
  "components": [
    {
      "name": "Component UI widget name (e.g. Testimonial carousel, Lead capture modal)",
      "purpose": "What this widget handles"
    }
  ],
  "seo": {
    "title": "Optimized HTML SEO title",
    "description": "Engaging HTML meta description tag content"
  }
}

Verify the output is valid JSON before sending.`;

  const userContent = `Project Name: ${projectName}
Business Type: ${businessType}
Niche Goal: ${websiteGoal}
Niche Description: ${description}
Prompt: ${prompt}`;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature: 0.2, // Keep deterministic JSON output
    });

    let rawText = response.content[0].text.trim();

    // Clean up potential markdown code fences wrapped around JSON outputs
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    const parsedData = JSON.parse(rawText);
    return {
      model,
      data: parsedData,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("AI returned an invalid JSON response payload format. Please try again.");
    }
    throw error;
  }
};

module.exports = {
  generateWebsiteStructure,
};
