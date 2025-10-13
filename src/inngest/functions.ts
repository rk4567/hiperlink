import { openai, createAgent } from "@inngest/agent-kit";


import { inngest } from "./client";
// import { success } from "zod";
// import { Sandbox } from '@e2b/code-interpreter'
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

    const summarizer = createAgent({
      name: "writer",
      system: "You are an expert writer.  You write readable, concise, simple content.",
      model: openai({ model: "gpt-4o" }),
    });

    const {output} = await summarizer.run(
      `Summarize the following text: ${event.data.value}`,

    );

    

    // await step.sleep("wait-a-moment", "5s");
    // return { message: `Hello ${event.data.value}!`};
    return { output };
    // const sandboxId = await step.run("get-sandbox-id"), async () => {
      // const sandboxId = await Sandbox.create("")}
    
  },
);