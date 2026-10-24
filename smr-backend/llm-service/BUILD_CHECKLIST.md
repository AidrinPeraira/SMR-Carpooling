# LLM Service — Build Checklist

## 1. Project Setup

- [x] Folder structure (domain, application, infrastructure, presentation)
- [x] Path aliases, tsconfig, DI wiring pattern
- [x] Application config

## 2. Domain Layer

- [x] ChatSession entity
- [x] ChatMessage entity
- [x] ToolCall entity
- [x] MessageRole and ChatSessionStatus enums

## 3. Application Layer — Ports

- [ ] ILlmPort — generate/stream responses (SDK-agnostic)
- [ ] IToolRegistryPort — connect/disconnect/get tools from MCP server
- [ ] IChatSessionPort — save/retrieve sessions from Redis

## 4. Application Layer — Use Cases

- [ ] StartSessionUseCase — create session, connect MCP clients, store in Redis
- [ ] StreamMessageUseCase — accept user message, call LLM port with tools, yield streamed response, persist updated session
- [ ] EndSessionUseCase — disconnect MCP clients, remove session from Redis

## 5. Infrastructure — LLM Adapter

- [ ] VercelAiLlmAdapter implementing ILlmPort using streamText
- [ ] Message mapping (domain types to/from SDK types)
- [ ] onStepFinish / onToolCall callback wiring

## 6. Infrastructure — MCP Adapters

- [ ] SmrMcpAdapter implementing IToolRegistryPort
- [ ] MapboxMcpAdapter implementing IToolRegistryPort

## 7. Infrastructure — Session Store

- [ ] RedisChatSessionStore implementing IChatSessionPort
- [ ] TTL-based expiry (15-30 min inactivity)

## 8. Presentation Layer

- [ ] ChatController — handles HTTP requests, delegates to use cases
- [ ] ChatRoutes — route definitions
- [ ] SSE streaming setup for StreamMessage responses
- [ ] LlmServiceModule — DI wiring, Express app bootstrap

## 9. System Prompt

- [ ] Role-aware prompt (driver vs passenger context)
- [ ] Tool usage instructions for the LLM
