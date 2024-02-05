import { z } from "zod";

export const WaiverFormSchema = z.object({
  email: z
    .string({
      errorMap: () => ({
        message: "Email is required and must be the correct format.",
      }),
    })
    .email(),
  fname: z
    .string({
      errorMap: () => ({
        message: "First name is required and must be 2 characters minimum.",
      }),
    })
    .min(2),
  lname: z
    .string({
      errorMap: () => ({
        message: "Last name is required and must be 2 characters minimum.",
      }),
    })
    .min(2),
  suburb: z
    .string({
      errorMap: () => ({
        message: "Suburb is required and must be 3 characters minimum.",
      }),
    })
    .min(3),
  postcode: z
    .string({
      errorMap: () => ({
        message: "Postcode is required and must be 4 characters minimum.",
      }),
    })
    .min(4)
    .max(10),
  phone: z
    .string({
      errorMap: () => ({
        message: "Phone number is required and must be 10 characters.",
      }),
    })
    .min(10),
  gender: z.enum(["Male", "Female", "Other", "Blank"], {
    errorMap: () => ({
      message: "Gender is a required field.",
    }),
  }),
  age: z.enum(["Under18", "18-30", "31-40", "41-50", "Above50", "Blank"], {
    errorMap: () => ({
      message: "Age is a required field.",
    }),
  }),
  satisfiesAgeReq: z.enum(["Over18", "HavePermission"], {
    errorMap: () => ({
      message: "This is a required field.",
    }),
  }),
  readTermsAndConditions: z.literal<boolean>(true, {
    errorMap: () => ({
      message:
        "It's a requirement that you read and accept the terms and conditions.",
    }),
  }),
  emergencyContactName: z
    .string({
      errorMap: () => ({
        message:
          "Emergency contact name is a required field and must be at least 2 characters.",
      }),
    })
    .min(2),
  emergencyContactPhone: z
    .string({
      errorMap: () => ({
        message:
          "Emergency contact phone is a required field and must be 10 characters.",
      }),
    })
    .min(10),
  referredBy: z.string().optional(),
});

export const UserFormSchema = z.object({
  name: z.string().min(3),
  role: z.enum(["member", "moderator", "admin"]),
});
