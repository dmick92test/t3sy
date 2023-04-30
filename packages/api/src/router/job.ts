import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const jobRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.job.findMany({
      orderBy: { id: "desc" },
      include: { organization: true },
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.job.findFirst({ where: { id: input.id } });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        rate: z.number().min(0.0),
        hours: z.string().min(2),
        streetAddress: z.string().min(2),
        city: z.string().min(2),
        province: z.string().min(2),
        description: z.string().min(2),
        organizationId: z.string().min(2),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.create({ data: input });
    }),
  update: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        rate: z.number().min(0.0),
        hours: z.string().min(2),
        description: z.string().min(2),
        id: z.string().min(2),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.job.update({
        data: {
          name: input.name,
          rate: input.rate,
          hours: input.hours,
          description: input.description,
        },
        where: { id: input.id },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.job.delete({ where: { id: input } });
  }),
});
