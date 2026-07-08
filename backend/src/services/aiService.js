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

const generateWebsiteBlueprint = async (consultationAnswers) => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("Anthropic API Key (CLAUDE_API_KEY) is not configured on the backend environment.");
  }

  const anthropic = new Anthropic({
    apiKey,
  });

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

  const systemPrompt = `You are a world-class principal system architect and UX planner.
Your task is to analyze website consultation answers and generate a highly detailed website blueprint.

You MUST respond with a single valid JSON object ONLY. Do NOT write any conversational text, explanations, or preambles.
The JSON payload must strictly follow this schema:
{
  "websiteType": "Strict category: e.g. Business, Portfolio, E-commerce, SaaS, Blog, Landing Page",
  "websiteGoal": "Strict goal: e.g. Lead Generation, Sales, Appointments, Brand Awareness",
  "pages": [
    {
      "name": "Page Title (e.g. Home)",
      "purpose": "Brief description of the page purpose",
      "sections": ["Section Name: brief content description"],
      "components": ["UI component/widget name"],
      "content": "Specific content copy guidelines",
      "buttons": ["Button label + action"],
      "images": ["Recommended image asset description"],
      "forms": ["Required form fields, if any"],
      "seoImportance": "High / Medium / Low - reason why"
    }
  ],
  "components": [
    "List of essential reusable component names: e.g. Navbar, Hero, Features, Testimonials, FAQ, Footer"
  ],
  "navigation": {
    "headerMenu": ["Label + link destination"],
    "footerLinks": ["Label + link destination"],
    "quickLinks": ["Label + link destination"],
    "ctaButtons": ["Label + destination"]
  },
  "design": {
    "style": "UI design recommendations: e.g. Minimalist Dark Mode, Glassmorphism Corporate",
    "icons": "Outline / Filled / Rounded / Modern",
    "animations": {
      "scroll": "Scroll recommendations",
      "hover": "Hover state descriptions",
      "transitions": "Transitions detail"
    },
    "images": {
      "style": "Recommended illustration/image style guidelines"
    }
  },
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "background": "#HEX",
    "text": "#HEX",
    "buttonColors": {
      "primary": "#HEX",
      "hover": "#HEX"
    }
  },
  "typography": {
    "headingFont": "Recommended heading font (e.g. Outfit)",
    "bodyFont": "Recommended body font (e.g. Inter)",
    "sizes": {
      "heading": "font sizes specs",
      "body": "body text specs"
    },
    "spacing": "Tracking and leading specs"
  },
  "features": [
    "Full feature checklist (e.g. Authentication, Booking, Payment, CMS)"
  ],
  "database": {
    "collections": ["MongoDB collections needed"],
    "relationships": ["Database entity relationship definitions"],
    "indexes": ["Recommended database indexes for performance"]
  },
  "seo": {
    "metaTitle": "Optimal home page meta title",
    "metaDescription": "Optimized meta description copy",
    "keywords": ["primary keywords"],
    "og": {
      "title": "Open Graph Title",
      "description": "Open Graph Description"
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "Twitter Card Title"
    },
    "schema": ["Recommended Schema.org markup types"]
  },
  "performance": [
    "Speed recommendations: e.g. Caching, Image optimization, Code splitting, Lazy loading"
  ],
  "responsive": [
    "Breakpoints layout recommendations: Mobile, Tablet, Desktop"
  ],
  "futureRecommendations": [
    "Long-term recommendations: e.g. AI Content, AI Chatbot integration"
  ]
}

Verify the output is valid JSON before sending.`;

  const userContent = `Analyze the following website requirements consultation answers and generate the blueprint:
${JSON.stringify(consultationAnswers, null, 2)}`;

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
      temperature: 0.3,
    });

    let rawText = response.content[0].text.trim();

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
  generateWebsiteBlueprint,
};

