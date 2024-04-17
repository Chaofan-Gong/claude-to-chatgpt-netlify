# claude-to-chatgpt-netlify

A Netlify Function based port of [jtsang4/claude-to-chatgpt](https://github.com/jtsang4/claude-to-chatgpt).

Netlify Function calls offer more resources than Cloudflare Workers and may be more performant in some use cases.

This project converts the API of Anthropic's Claude model to the OpenAI Chat API format.

- ✨ Call Claude API like OpenAI ChatGPT API
- 💦 Support streaming response
- 🐻 Support claude-instant-1, claude-2 models

## Deploy to Netlify

Click this button to deploy the project to your Netlify account:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/samestrin/claude-to-chatgpt-netlify)

## Endpoints

Once deployed, two endpoints are available:

- `/v1/models`
- `/v1/chat/completions`

## Testing your claude-to-chatgpt-netlify Deployment Locally

Start your Netlify dev server using the command:

```
netlify dev
```

then use the following curl command to test your deployment:

```
curl -X POST http://localhost:8888/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: YOUR_CLAUDE_API_KEY" \
-d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello, how are you?"}]}'
```
