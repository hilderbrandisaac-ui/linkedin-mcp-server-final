/**
 * Service Worker for LinkedIn MCP Server
 * Handles MCP protocol requests and caching
 */

const CACHE_NAME = 'linkedin-mcp-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/mcpServer.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return clients.claim();
        })
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle MCP endpoint requests
    if (url.pathname === '/mcp' && event.request.method === 'POST') {
        event.respondWith(handleMCPRequest(event.request));
        return;
    }

    // Handle CORS preflight for MCP endpoint
    if (url.pathname === '/mcp' && event.request.method === 'OPTIONS') {
        event.respondWith(handleCORSPreflight());
        return;
    }

    // Handle static assets with cache-first strategy
    if (event.request.method === 'GET') {
        event.respondWith(handleStaticRequest(event.request));
        return;
    }
});

/**
 * Handle MCP protocol requests
 */
async function handleMCPRequest(request) {
    try {
        console.log('Handling MCP request');
        const requestData = await request.json();
        
        // Create MCP server instance
        const mcpServer = createMCPServerInstance();
        
        const method = requestData.method;
        const params = requestData.params || {};
        const requestId = requestData.id;
        
        let response;
        
        // Route MCP methods
        switch (method) {
            case 'initialize':
                response = mcpServer.handleInitialize(params);
                break;
            case 'tools/list':
                response = mcpServer.handleToolsList();
                break;
            case 'tools/call':
                response = mcpServer.handleToolsCall(params);
                break;
            default:
                response = {
                    jsonrpc: "2.0",
                    error: {
                        code: -32601,
                        message: 'Method not found: ' + method,
                        data: {
                            supportedMethods: ['initialize', 'tools/list', 'tools/call']
                        }
                    }
                };
        }

        // Add request ID if present
        if (requestId !== undefined) {
            response.id = requestId;
        }

        return createJSONResponse(response, 200);

    } catch (error) {
        console.error('MCP request error:', error);
        return createJSONResponse({
            jsonrpc: "2.0",
            error: {
                code: -32603,
                message: 'Internal error: ' + error.message,
                data: {
                    timestamp: new Date().toISOString()
                }
            }
        }, 500);
    }
}

/**
 * Handle CORS preflight requests
 */
function handleCORSPreflight() {
    return new Response(null, {
        status: 200,
        headers: getCORSHeaders()
    });
}

/**
 * Handle static file requests with caching
 */
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }

        // Fallback to network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Static request error:', error);
        
        // Return cached version if network fails
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return error response
        return new Response('Service Unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Create MCP Server instance (simplified for Service Worker)
 */
function createMCPServerInstance() {
    return {
        handleInitialize(params) {
            return {
                jsonrpc: "2.0",
                result: {
                    serverInfo: {
                        name: 'linkedin-mcp-server',
                        version: '1.0.0',
                        protocol: 'MCP 1.0'
                    },
                    capabilities: {
                        tools: { listChanged: false },
                        resources: { subscribe: false, listChanged: false }
                    }
                }
            };
        },

        handleToolsList() {
            return {
                jsonrpc: "2.0",
                result: {
                    tools: [
                        {
                            name: "get_profile",
                            description: "Get LinkedIn profile information for the current user",
                            inputSchema: { type: "object", properties: {}, required: [] }
                        },
                        {
                            name: "create_post",
                            description: "Create a new LinkedIn post", 
                            inputSchema: {
                                type: "object",
                                properties: {
                                    text: { type: "string", description: "The text content of the post" },
                                    visibility: { 
                                        type: "string", 
                                        description: "Post visibility (PUBLIC or CONNECTIONS)",
                                        enum: ["PUBLIC", "CONNECTIONS"],
                                        default: "PUBLIC"
                                    }
                                },
                                required: ["text"]
                            }
                        },
                        {
                            name: "search_organizations",
                            description: "Search for LinkedIn organizations",
                            inputSchema: {
                                type: "object",
                                properties: {
                                    query: { type: "string", description: "Search query" },
                                    limit: { type: "number", description: "Max results", default: 10 }
                                },
                                required: ["query"]
                            }
                        },
                        {
                            name: "get_organizations",
                            description: "Get user's organizations",
                            inputSchema: {
                                type: "object",
                                properties: {
                                    role: { type: "string", description: "Filter by role" }
                                },
                                required: []
                            }
                        }
                    ]
                }
            };
        },

        handleToolsCall(params) {
            const toolName = params.name;
            const args = params.arguments || {};
            
            let result;
            switch(toolName) {
                case "get_profile":
                    result = {
                        status: "demo",
                        data: {
                            id: "demo-user",
                            name: "Demo LinkedIn User",
                            headline: "Professional using MCP Server",
                            location: "San Francisco, CA"
                        }
                    };
                    break;
                case "create_post":
                    result = {
                        status: "success",
                        message: 'Post would be created: "' + args.text + '"',
                        data: {
                            visibility: args.visibility || "PUBLIC",
                            id: 'post-' + Date.now(),
                            createdAt: new Date().toISOString()
                        }
                    };
                    break;
                case "search_organizations":
                    result = {
                        status: "demo",
                        data: {
                            elements: [{
                                id: 'org-' + Date.now(),
                                name: 'Demo Organization for "' + args.query + '"',
                                industry: "Technology"
                            }]
                        }
                    };
                    break;
                case "get_organizations":
                    result = {
                        status: "demo", 
                        data: {
                            elements: [{
                                organization: "urn:li:organization:demo123",
                                role: args.role || "MEMBER",
                                state: "APPROVED"
                            }]
                        }
                    };
                    break;
                default:
                    result = { error: 'Unknown tool: ' + toolName };
            }

            return {
                jsonrpc: "2.0",
                result: {
                    content: [{
                        type: "text", 
                        text: JSON.stringify(result, null, 2)
                    }]
                }
            };
        }
    };
}

/**
 * Create JSON response with CORS headers
 */
function createJSONResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            ...getCORSHeaders()
        }
    });
}

/**
 * Get CORS headers
 */
function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400'
    };
}