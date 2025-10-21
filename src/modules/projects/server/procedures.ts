import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
    getOne: baseProcedure
    .input(z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
    }))
    .query(async ({ input }) => {
        const existingproject = await prisma.project.findUnique({
            where: {
                id: input.id,
            },
        });

        if (!existingproject) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
        }
        return existingproject;
    }),
    getMany: baseProcedure
    .query(async () => {
        const projects = await prisma.project.findMany({
            orderBy:{

            },
        })
        return projects;
    }),
    create: baseProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message: "Prompt is required" })
            .max(5000, { message: "Prompt is too long" }),
        }),
    )
    .mutation(async({ input }) =>{
        const createdProject = await prisma.project.create({
            data: {
                name: generateSlug(2, {
                    format: "kebab",
                    }),
            messages: {
                create: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                }
            }
        }
        });


        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
                projectId: createdProject.id,
            },
        });

        return createdProject;
    }),
});
