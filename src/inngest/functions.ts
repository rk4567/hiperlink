import { inngest } from "./client";
// import { Sandbox } from '@e2b/code-interpreter'
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!`};
    // const sandboxId = await step.run("get-sandbox-id"), async () => {
      // const sandboxId = await Sandbox.create("")}
    
  },
);