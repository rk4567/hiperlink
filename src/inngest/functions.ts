
import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
// import { success } from "zod";
import { Sandbox } from '@e2b/code-interpreter'
import { getSandbox } from "./utils";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("hiperlink");
      return sandbox.sandboxId;
    });

    const summarizer = createAgent({
      name: "code-agent",
      system: "You are an expert writer.  You write readable, concise, simple content.",
      model: openai({ model: "gpt-4o" }),
    });

    const {output} = await summarizer.run(
      `Summarize the following text: ${event.data.value}`,

    );
    
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })
    

    // await step.sleep("wait-a-moment", "5s");
    // return { message: `Hello ${event.data.value}!`};
    return { output, sandboxUrl };
    // const sandboxId = await step.run("get-sandbox-id"), async () => {
    // const sandboxId = await Sandbox.create("")}
    
  },
);