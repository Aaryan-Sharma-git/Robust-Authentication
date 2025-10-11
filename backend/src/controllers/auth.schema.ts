import z from 'zod/v4';

const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  userAgent: z.string().optional(),
});

const registrationSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'passwords does not match!',
    path: ['confirmPassword'],
  });

const verificationCodeSchema = z.string().min(1).max(24);
const emailSchema = z.email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);

const resetPasswordSchema = z.object({
  verificationCode: verificationCodeSchema,
  password: passwordSchema,
});

export {
  loginSchema,
  registrationSchema,
  verificationCodeSchema,
  emailSchema,
  passwordSchema,
  resetPasswordSchema,
};
