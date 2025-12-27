import { z } from 'zod';

export const registerSchema = z.object({
     username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters'),
     email: z.string().email('Invalid email address'),
     password: z.string().min(6, 'Password must be at least 6 characters'),
     fullName: z.string().max(100).optional(),
     bio: z.string().max(500).optional(),
     address: z.string().max(200).optional(),
     mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits').optional().or(z.literal('')),
     aadhar: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').optional().or(z.literal('')),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const blogSchema = z.object({
     title: z.string().min(1, 'Title is required').max(200),
     content: z.string().min(1, 'Content is required'),
     summary: z.string().max(500).optional(),
     category: z.string().optional(),
     tags: z.string().optional(),
     status: z.enum(['draft', 'published']).optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
});


export const profileUpdateSchema = z.object({
  fullName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits').optional().or(z.literal('')),
  aadhar: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').optional().or(z.literal('')),
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     