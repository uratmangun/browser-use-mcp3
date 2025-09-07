import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";

// Define the schema for tool parameters
export const schema = {
  name: z.string().describe("The name of the user to create a new session for"),
};

// Define tool metadata
export const metadata: ToolMetadata = {
  name: "new_session",
  description: "Create a new session",
  annotations: {
    title: "Create a new session",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Tool implementation
export default async function newSession({ name }: InferSchema<typeof schema>) {
  const apiKey = process.env.MY_API_KEY;
  if (!apiKey) throw new Error("Missing MY_API_KEY env variable");
  const result = `New session created for ${name}`;

  return {
    content: [{ type: "text", text: result }],
  };
}
