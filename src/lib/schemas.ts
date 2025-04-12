import { z } from "zod";
import { ROLES } from "./constants";
import { isValidPhoneNumber } from "react-phone-number-input";

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
  alias: z
    .union([z.string().length(0), z.string().min(5)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
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
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
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
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  referredBy: z
    .union([z.string().length(0), z.string()])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export const AccountDetailsSchema = z.object({
  name: z.string().min(5),
  alias: z
    .union([
      z
        .string({
          errorMap: () => ({
            message: "Alias must be either blank or 5 characters minimum.",
          }),
        })
        .length(0),
      z.string().min(5),
    ])
    .optional(),
});

export const RoleRequestSchema = z.object({
  role: z.enum([ROLES.MEMBER, ROLES.MODERATOR, ROLES.ADMIN]),
});
