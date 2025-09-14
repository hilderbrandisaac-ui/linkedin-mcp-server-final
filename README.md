# 🔗 LinkedIn MCP Server

[![Deploy Status](https://github.com/YOUR_USERNAME/linkedin-mcp-server/workflows/Deploy%20LinkedIn%20MCP%20Server/badge.svg)](https://github.com/YOUR_USERNAME/linkedin-mcp-server/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Protocol](https://img.shields.io/badge/MCP-1.0-blue.svg)](https://modelcontextprotocol.io/)

A serverless Model Context Protocol (MCP) server that enables AI models like ChatGPT and Claude to interact with LinkedIn through a standardized interface. Built for developers learning MCP server development.

## 🌟 Features

- **🆓 Zero Cost**: Hosted entirely on GitHub Pages for free
- **🚀 Easy Integration**: Simple URL endpoint for AI model connection  
- **🔧 LinkedIn Tools**: Profile access, posting, organization search
- **🌐 CORS Enabled**: Works with web-based AI clients
- **⚡ Serverless**: Powered by GitHub Actions and Service Workers
- **📚 Learning-Friendly**: Well-documented code structure for beginners

## 📁 Project Structure

```
linkedin-mcp-server/
├── src/
│   └── public/
│       ├── index.html          # Main server interface
│       ├── mcpServer.js        # MCP server implementation  
│       └── sw.js               # Service worker for request handling
├── examples/
│   ├── test-requests.json      # Example API requests
│   └── test-server.js          # Test script
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── package.json                # Node.js package configuration
└── README.md                   # This file
```

## 🚀 Quick Start

### For AI Models (ChatGPT, Claude, etc.)

Use this MCP server endpoint:
```
https://YOUR_USERNAME.github.io/linkedin-mcp-server/mcp
```

### Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_profile` | Get LinkedIn profile information | None |
| `create_post` | Create LinkedIn posts | `text`, `visibility` |
| `search_organizations` | Search for organizations | `query`, `limit` |
| `get_organizations` | Get user's organization access | `role` (optional) |

## 🛠️ Setup & Deployment

### Quick Deploy
1. Fork this repository
2. Enable GitHub Pages in repository settings  
3. Your MCP server will be live at `https://yourusername.github.io/linkedin-mcp-server`

### Local Development
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-mcp-server.git
cd linkedin-mcp-server
python -m http.server 8000 --directory src/public
```

## 📖 Usage Examples

### ChatGPT Integration
1. Add MCP server: `https://yourusername.github.io/linkedin-mcp-server/mcp`
2. Test: "Use LinkedIn to get my profile information"

### API Testing
```bash
curl -X POST https://your-server.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

## 🧪 Testing

Run the built-in tests by visiting your deployed server and clicking the test buttons, or use the examples in `examples/test-requests.json`.

## 📋 MCP Protocol Compliance

- ✅ JSON-RPC 2.0 over HTTP
- ✅ `tools/list` and `tools/call` methods
- ✅ Proper error handling
- ✅ CORS support
- ✅ Service Worker architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own projects!

## 🔗 Resources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [LinkedIn API Documentation](https://docs.microsoft.com/linkedin/)
- [GitHub Pages Guide](https://pages.github.com/)

---

**🎉 Your LinkedIn MCP Server is ready! Start connecting AI to LinkedIn today!**