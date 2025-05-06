import { users, searchHistory, type User, type InsertUser, type SearchHistory, type InsertSearchHistory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveSearchHistory(searchHistory: InsertSearchHistory): Promise<SearchHistory>;
  getSearchHistory(userId: number): Promise<SearchHistory[]>;
  getFavoriteSearches(userId: number): Promise<SearchHistory[]>;
  toggleFavorite(id: number): Promise<SearchHistory | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async saveSearchHistory(history: InsertSearchHistory): Promise<SearchHistory> {
    const [result] = await db
      .insert(searchHistory)
      .values(history)
      .returning();
    return result;
  }

  async getSearchHistory(userId: number): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.timestamp))
      .limit(20);
  }

  async getFavoriteSearches(userId: number): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(
        eq(searchHistory.userId, userId)
      )
      .where(
        eq(searchHistory.favorite, true)
      )
      .orderBy(desc(searchHistory.timestamp));
  }

  async toggleFavorite(id: number): Promise<SearchHistory | undefined> {
    // First get the current search history item
    const [currentItem] = await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.id, id));

    if (!currentItem) {
      return undefined;
    }

    // Toggle the favorite status
    const [updatedItem] = await db
      .update(searchHistory)
      .set({ favorite: !currentItem.favorite })
      .where(eq(searchHistory.id, id))
      .returning();

    return updatedItem;
  }
}

export const storage = new DatabaseStorage();
