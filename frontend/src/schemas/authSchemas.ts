import {z} from 'zod'

const userSchema = z.object({
    _id: z.string().min(1).max(24),
    email: z.email().min(1),
    createdAt: z.coerce.date(),
    verified: z.boolean()
})

const sessionSchema = z.object({
    _id: z.string().min(1).max(24),
    userId: z.string().min(1).max(24),
    userAgent: z.string().optional(),
    createdAt: z.coerce.date(),
    isCurrent: z.boolean().optional()
})

const sessionArraySchema = z.array(sessionSchema).min(1);

export type userType = z.infer<typeof userSchema>;
export type sessionArrayType = z.infer<typeof sessionArraySchema>
export type SessionType = z.infer<typeof sessionSchema>