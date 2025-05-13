import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || DATABASE_URL.includes('username:password')) {
  console.warn(
    "DATABASE_URL must be set with valid credentials. Using in-memory mock database instead (data will not persist between restarts).",
  );
  // This allows the app to start for testing purposes without a real database
}

// Only create the pool if we have a valid DATABASE_URL
const pool = DATABASE_URL && !DATABASE_URL.includes('username:password') 
  ? new Pool({ connectionString: DATABASE_URL }) 
  : null;

// In-memory storage for mock database
const memoryStorage = {
  users: [],
  searchHistory: []
};

// Use pool if available or create a mock db object
export const db = pool ? drizzle(pool, { schema }) : {
  select: () => ({
    from: (table) => ({
      where: () => {
        console.warn("Mock database: select operation");
        return [];
      },
      orderBy: () => ({
        limit: () => []
      })
    })
  }),
  insert: (table) => ({
    values: (data) => ({
      returning: () => {
        console.warn("Mock database: insert operation");
        if (table.name === 'users') {
          const user = { ...data, id: memoryStorage.users.length + 1 };
          memoryStorage.users.push(user);
          return [user];
        } else if (table.name === 'search_history') {
          const history = { ...data, id: memoryStorage.searchHistory.length + 1 };
          memoryStorage.searchHistory.push(history);
          return [history];
        }
        return [data];
      }
    })
  }),
  update: (table) => ({
    set: (data) => ({
      where: () => ({
        returning: () => {
          console.warn("Mock database: update operation");
          return [{ ...data, id: 1 }];
        }
      })
    })
  }),
  query: async () => {
    console.warn("Database operations not available: Using mock database");
    return [];
  }
} as any;

export { pool };
