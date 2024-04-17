const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Extract method and headers from the event
  const { httpMethod: method, headers, body } = event;

  // Set constants and environment variables
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  const CLAUDE_BASE_URL =
    process.env.CLAUDE_BASE_URL || "https://api.anthropic.com";
  const MAX_TOKENS = process.env.CLAUDE_MAX_TOKENS || 100000;
  const MAX_REQUEST_SIZE_BYTES =
    process.env.CLAUDE_MAX_REQUEST_SIZE_BYTES || 1048576;

  // Handle OPTIONS request for CORS
  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    };
  }

  // Validate POST request
  if (method === "POST") {
    if (headers["content-length"] > MAX_REQUEST_SIZE_BYTES) {
      return { statusCode: 413, body: "Request payload too large" };
    }

    try {
      const jsonBody = JSON.parse(body);
      const apiKey = headers["authorization"]
        ? headers["authorization"].split(" ")[1]
        : CLAUDE_API_KEY;

      // Construct the request to the Claude API
      const { model, messages, temperature, stop, stream } = jsonBody;
      const prompt = convertMessagesToPrompt(messages);
      const claudeRequestBody = {
        prompt,
        model: model_map[model] || "default-model",
        temperature,
        max_tokens_to_sample: MAX_TOKENS,
        stop_sequences: stop,
        stream,
      };

      const response = await fetch(`${CLAUDE_BASE_URL}/v1/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(claudeRequestBody),
      });

      const responseData = await response.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      };
    } catch (error) {
      return { statusCode: 500, body: "Internal Server Error" };
    }
  } else {
    return { statusCode: 405, body: "Method not allowed" };
  }
};

function convertMessagesToPrompt(messages) {
  let prompt = "";
  messages.forEach((message) => {
    const { role, content } = message;
    prompt += `\n\n${role_map[role] || "Human"}: ${content}`;
  });
  prompt += "\n\nAssistant: ";
  return prompt;
}

const role_map = {
  system: "Human",
  user: "Human",
  assistant: "Assistant",
};

const model_map = {
  "gpt-3.5-turbo": "claude-instant-1",
  "gpt-3.5-turbo-0613": "claude-instant-1",
  "gpt-4": "claude-2",
  "gpt-4-0613": "claude-2",
};
