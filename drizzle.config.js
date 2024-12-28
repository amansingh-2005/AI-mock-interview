import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  // out: "./drizzle",
  dbCredentials:{url:'postgresql://ai-interview_owner:9AxwiFBdkc8O@ep-old-flower-a5kgngge.us-east-2.aws.neon.tech/ai-interview?sslmode=require',}
});
  
