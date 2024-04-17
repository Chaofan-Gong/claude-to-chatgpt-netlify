let fetch;

exports.handler = async function (event, context) {
  // Dynamically import fetch on the first run
  if (!fetch) {
    fetch = (await import("node-fetch")).default;
  }

  const {
    httpMethod: method,
    path,
    headers,
    body,
    queryStringParameters,
  } = event;

  // Set constants and environment variables
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  const CLAUDE_BASE_URL =
    process.env.CLAUDE_BASE_URL || "https://api.anthropic.com";
  const MAX_TOKENS = process.env.CLAUDE_MAX_TOKENS || 100000;
  const MAX_REQUEST_SIZE_BYTES =
    process.env.CLAUDE_MAX_REQUEST_SIZE_BYTES || 1048576;

  // Handle OPTIONS request for CORS
  if (method === "OPTIONS") {
    return handleOPTIONS();
  }

  // Handle GET request
  if (method === "GET") {
    if (path.endsWith("/v1/models")) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          object: "list",
          data: models_list,
        }),
      };
    } else {
      return { statusCode: 404, body: "Not Found" };
    }
  }

  // Validate POST request
  if (method === "POST") {
    if (
      !headers["content-length"] ||
      headers["content-length"] > MAX_REQUEST_SIZE_BYTES
    ) {
      // 1 MB
      return { statusCode: 413, body: "Request payload too large" };
    }

    try {
      const jsonBody = JSON.parse(body);
      const apiKey = getAPIKey(headers) || CLAUDE_API_KEY;

      if (!apiKey) {
        return {
          statusCode: 403,
          body: "API key not provided or invalid",
        };
      }

      const { model, messages, temperature, stop, stream } = jsonBody;
      const prompt = convertMessagesToPrompt(messages);
      const claudeRequestBody = {
        prompt,
        model: model_map[model] || "claude-2",
        temperature,
        max_tokens_to_sample: MAX_TOKENS,
        stop_sequences: stop,
        stream,
      };

      const response = await fetch(`${CLAUDE_BASE_URL}/v1/complete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(claudeRequestBody),
      });

      if (!stream) {
        const responseData = await response.json();
        const openAIResponse = claudeToChatGPTResponse(responseData);
        return {
          statusCode: response.status,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(openAIResponse),
        };
      } else {
        // Handle streaming responses here
        // Netlify functions do not support streaming responses in the same way Cloudflare Workers do,
        // so this would need to be adjusted depending on your use case.
        return { statusCode: 501, body: "Streaming not supported" };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        body: "Internal Server Error: " + error.message,
      };
    }
  }

  return { statusCode: 405, body: "Method not allowed" };
};

function handleOPTIONS() {
  return {
    statusCode: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  };
}

function getAPIKey(headers) {
  const authorization = headers["authorization"];
  if (authorization) {
    return authorization.split(" ")[1];
  }
  return false; // Default API key or throw an error if essential
}

function convertMessagesToPrompt(messages) {
  let prompt = "";
  messages.forEach((message) => {
    const role = message["role"];
    const content = message["content"];
    const transformed_role = role_map[role] || "Human";
    prompt += `\n\n${transformed_role}: ${content}`;
  });
  prompt += "\n\nAssistant: ";
  return prompt;
}

function claudeToChatGPTResponse(claudeResponse, stream = false) {
  console.log(claudeResponse);
  const completion = claudeResponse["completion"];
  const timestamp = Math.floor(Date.now() / 1000);

  let completionTokens = 0;
  if (completion) {
    completionTokens = completion.split(" ").length;
  }

  const result = {
    id: `chatcmpl-${timestamp}`,
    created: timestamp,
    model: "gpt-3.5-turbo-0613",
    usage: {
      prompt_tokens: 0,
      completion_tokens: completionTokens,
      total_tokens: completionTokens,
    },
    choices: [
      {
        index: 0,
        finish_reason: claudeResponse["stop_reason"]
          ? stop_reason_map[claudeResponse["stop_reason"]]
          : null,
      },
    ],
  };
  const message = {
    role: "assistant",
    content: completion,
  };
  if (!stream) {
    result.object = "chat.completion";
    result.choices[0].message = message;
  } else {
    result.object = "chat.completion.chunk";
    result.choices[0].delta = message;
  }
  return result;
}

const role_map = {
  system: "Human",
  user: "Human",
  assistant: "Assistant",
};

const stop_reason_map = {
  stop_sequence: "stop",
  max_tokens: "length",
};

const model_map = {
  "gpt-3.5-turbo": "claude-instant-1",
  "gpt-3.5-turbo-0613": "claude-instant-1",
  "gpt-4": "claude-2",
  "gpt-4-0613": "claude-2",
};

const models_list = [
  {
    id: "gpt-3.5-turbo",
    object: "model",
    created: 1677610602,
    owned_by: "openai",
    permission: [
      {
        id: "modelperm-YO9wdQnaovI4GD1HLV59M0AV",
        object: "model_permission",
        created: 1683753011,
        allow_create_engine: false,
        allow_sampling: true,
        allow_logprobs: true,
        allow_search_indices: false,
        allow_view: true,
        allow_fine_tuning: false,
        organization: "*",
        group: null,
        is_blocking: false,
      },
    ],
    root: "gpt-3.5-turbo",
    parent: null,
  },
  {
    id: "gpt-3.5-turbo-0613",
    object: "model",
    created: 1677649963,
    owned_by: "openai",
    permission: [
      {
        id: "modelperm-tsdKKNwiNtHfnKWWTkKChjoo",
        object: "model_permission",
        created: 1683753015,
        allow_create_engine: false,
        allow_sampling: true,
        allow_logprobs: true,
        allow_search_indices: false,
        allow_view: true,
        allow_fine_tuning: false,
        organization: "*",
        group: null,
        is_blocking: false,
      },
    ],
    root: "gpt-3.5-turbo-0613",
    parent: null,
  },
  {
    id: "gpt-4",
    object: "model",
    created: 1678604602,
    owned_by: "openai",
    permission: [
      {
        id: "modelperm-nqKDpzYoZMlqbIltZojY48n9",
        object: "model_permission",
        created: 1683768705,
        allow_create_engine: false,
        allow_sampling: false,
        allow_logprobs: false,
        allow_search_indices: false,
        allow_view: false,
        allow_fine_tuning: false,
        organization: "*",
        group: null,
        is_blocking: false,
      },
    ],
    root: "gpt-4",
    parent: null,
  },
  {
    id: "gpt-4-0613",
    object: "model",
    created: 1678604601,
    owned_by: "openai",
    permission: [
      {
        id: "modelperm-PGbNkIIZZLRipow1uFL0LCvV",
        object: "model_permission",
        created: 1683768678,
        allow_create_engine: false,
        allow_sampling: false,
        allow_logprobs: false,
        allow_search_indices: false,
        allow_view: false,
        allow_fine_tuning: false,
        organization: "*",
        group: null,
        is_blocking: false,
      },
    ],
    root: "gpt-4-0613",
    parent: null,
  },
];
