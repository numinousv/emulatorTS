// Static OpenAPI document served at GET /doc and rendered at GET /ui.
// Kept static (no codegen dep) so it works identically on Node and Workers.
// Update this file when routes change.

const GameSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    core: { type: "string" },
    url: { type: "string" },
    description: { type: "string" },
    consoleId: { type: "string" },
  },
};

const ConsoleSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    icon: { type: "string" },
    color: { type: "string" },
    core: { type: "string" },
  },
};

const ConsoleWithCountSchema = {
  type: "object",
  properties: {
    ...ConsoleSchema.properties,
    count: { type: "integer", description: "Number of games for this console" },
  },
};

export const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "Arcade Emulator API",
    version: "1.0.0",
    description:
      "Backend API for the web emulator: consoles, games, save progress, playtime, and an archive.org proxy.",
  },
  paths: {
    "/": {
      get: {
        summary: "Root",
        responses: {
          "200": {
            description: "API identifier message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: { "text/plain": { schema: { type: "string" } } },
          },
        },
      },
    },
    "/doc": {
      get: {
        summary: "Raw OpenAPI document (this file)",
        responses: {
          "200": { description: "OpenAPI JSON document" },
        },
      },
    },
    "/ui": {
      get: {
        summary: "Swagger UI rendering /doc",
        responses: {
          "200": { description: "Swagger UI HTML page" },
        },
      },
    },
    "/api/consoles": {
      get: {
        summary: "List consoles that have at least one game",
        responses: {
          "200": {
            description: "Consoles with game counts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: ConsoleWithCountSchema,
                },
              },
            },
          },
        },
      },
    },
    "/api/consoles/{id}": {
      get: {
        summary: "Get a console with its games",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Console plus embedded games array",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ...ConsoleSchema.properties,
                    games: { type: "array", items: GameSchema },
                  },
                },
              },
            },
          },
          "404": { description: "Console not found" },
        },
      },
    },
    "/api/games": {
      get: {
        summary: "List all games",
        responses: {
          "200": {
            description: "All games",
            content: {
              "application/json": {
                schema: { type: "array", items: GameSchema },
              },
            },
          },
        },
      },
    },
    "/api/games/{id}": {
      get: {
        summary: "Get a game by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "The game",
            content: {
              "application/json": { schema: GameSchema },
            },
          },
          "404": { description: "Game not found" },
        },
      },
    },
    "/api/progress": {
      post: {
        summary: "Save (upsert) game progress for a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "gameId"],
                properties: {
                  userId: { type: "string" },
                  gameId: { type: "string" },
                  score: { type: "number" },
                  saveData: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Saved progress wrapped as { success, data }" },
        },
      },
    },
    "/api/playtime": {
      post: {
        summary: "Save (upsert) total playtime for a user + game",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "gameId", "playtime"],
                properties: {
                  userId: { type: "string" },
                  gameId: { type: "string" },
                  playtime: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Saved playtime wrapped as { success, data }" },
        },
      },
    },
    "/api/recent/{userId}": {
      get: {
        summary: "Last 5 updated progress entries for a user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Recent entries wrapped as { success, data }",
          },
        },
      },
    },
    "/api/archive/{path}": {
      get: {
        summary: "Proxy a request to archive.org with permissive CORS headers",
        parameters: [
          {
            name: "path",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Path appended to https://archive.org",
          },
        ],
        responses: {
          "200": { description: "Proxied archive.org response" },
        },
      },
    },
  },
};
