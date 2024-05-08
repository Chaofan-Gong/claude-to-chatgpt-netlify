# claude-to-chatgpt-netlify

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/stargazers) [![Fork on GitHub](https://img.shields.io/github/forks/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/network/members) [![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/claude-to-chatgpt-netlify?style=social)](https://github.com/samestrin/claude-to-chatgpt-netlify/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.1-blue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

A Node.js Netlify Function based port of [jtsang4/claude-to-chatgpt](https://github.com/jtsang4/claude-to-chatgpt)'s cloudflare-worker.js.

Netlify Function calls offer _slightly_ more resources than Cloudflare Workers and may be more performant in some use cases.

This project converts the API of Anthropic's Claude model to the OpenAI Chat API format.

- ✨ Call Claude API like OpenAI ChatGPT API
- ~~💦 Support streaming response~~ (_Netlify Functions do not support streaming_)
- 🐻 Support claude-instant-1, claude-2 models

A PHP port, designed to deploy on DigitalOcean App Platform, is available [samestrin/claude-to-chatgpt-digitalocean](https://github.com/samestrin/claude-to-chatgpt-digitalocean) here.

## Deploy to Netlify

Click this button to deploy the project to your Netlify account:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/samestrin/claude-to-chatgpt-netlify)

## **Endpoints**

### **Chat Completion**

**Endpoint:** `/v1/chat/completions`  
**Method:** POST

Simulate ChatGPT-like interaction by sending a message to the Claude model.

#### **Parameters**

- `model`: The OpenAI model (e.g., 'gpt-3.5-turbo') or Claude model (e.g.,'claude-instant-1') to use. (OpenAI models are automatically mapped to Claude models.)
- `messages`: An array of message objects where each message has a `role` ('user' or 'assistant') and `content`.

#### **Example Usage**

Use a tool like Postman or curl to make a request:

```bash
curl -X POST http://localhost:[PORT]/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
    "model": "claude-instant-1",
    "messages": [
        {"role": "user", "content": "Hello, how are you?"}
    ]
}'
```

The server will process the request and return the model's response in JSON format.

### **Model Information**

**Endpoint:** `/v1/models`  
**Method:** GET

Retrieve information about the available models.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost:[PORT]/v1/models
```

The server will return a list of available models and their details in JSON format.

### **CORS Pre-flight Request**

**Endpoint:** `/`  
**Method:** OPTIONS

Handle pre-flight requests for CORS (Cross-Origin Resource Sharing). This endpoint provides necessary headers in response to pre-flight checks performed by browsers to ensure that the server accepts requests from allowed origins.

#### **Example Usage**

This is typically used by browsers automatically before sending actual requests, but you can manually test CORS settings using curl:

```bash
curl -X OPTIONS http://localhost:[PORT]/ \
-H "Access-Control-Request-Method: POST" \
-H "Origin: http://example.com"
```

The server responds with appropriate CORS headers such as Access-Control-Allow-Origin.

## Testing Your Netlify Deployment Locally

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

## Share

[![Twitter](https://img.shields.io/badge/X-Tweet-blue)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://github.com/samestrin/claude-to-chatgpt-netlify) [![Facebook](https://img.shields.io/badge/Facebook-Share-blue)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/samestrin/claude-to-chatgpt-netlify) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Share-blue)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/samestrin/claude-to-chatgpt-netlify)
