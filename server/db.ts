import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize admin user (only in development)
export async function initializeAdmin() {
  try {
    // Only create default admin in development
    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode: Skipping default admin creation');
      return;
    }

    const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.username, 'admin')).limit(1);
    
    if (existingAdmin.length === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await db.insert(schema.users).values({
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true
      });
      
      console.log(`Admin user created: username=${adminUsername}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Development password: ${adminPassword}`);
      }
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
}

// Initialize admin on startup
initializeAdmin();
