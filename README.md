# claude-to-chatgpt-netlify

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/stargazers) [![Fork on GitHub](https://img.shields.io/github/forks/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/network/members) [![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.2-blue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

A Netlify Function based port of [jtsang4/claude-to-chatgpt](https://github.com/jtsang4/claude-to-chatgpt)'s cloudflare-worker.js.

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
