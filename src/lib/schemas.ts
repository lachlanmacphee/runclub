import { z } from "zod";
import { ROLES } from "./constants";
import { isValidPhoneNumber } from "react-phone-number-input";

export const WaiverFormSchema = z.object({
  email: z.email("Email is required and must be the correct format."),
  fname: z
    .string("First name is required and must be 2 characters minimum.")
    .min(2, "First name is required and must be 2 characters minimum."),
  lname: z
    .string("Last name is required and must be 2 characters minimum.")
    .min(2, "Last name is required and must be 2 characters minimum."),
  alias: z
    .union([z.string().length(0), z.string().min(5)])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  suburb: z
    .string("Suburb is required and must be 3 characters minimum.")
    .min(3, "Suburb is required and must be 3 characters minimum."),
  postcode: z
    .string("Postcode is required and must be 4 characters minimum.")
    .min(4, "Postcode is required and must be 4 characters minimum.")
    .max(10, "Postcode is required and must be 4 characters minimum."),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { error: "Invalid phone number" }),
  gender: z.enum(["Male", "Female", "Other", "Blank"], {
    error: "Gender is a required field.",
  }),
  age: z.enum(["Under18", "18-30", "31-40", "41-50", "Above50", "Blank"], {
    error: "Age is a required field.",
  }),
  satisfiesAgeReq: z.enum(["Over18", "HavePermission"], {
    error: "This is a required field.",
  }),
  readTermsAndConditions: z.literal<boolean>(true, {
    error:
      "It's a requirement that you read and accept the terms and conditions.",
  }),
  emergencyContactName: z
    .string(
      "Emergency contact name is a required field and must be at least 2 characters.",
    )
    .min(
      2,
      "Emergency contact name is a required field and must be at least 2 characters.",
    ),
  emergencyContactPhone: z
    .string()
    .refine(isValidPhoneNumber, { error: "Invalid phone number" }),
  referredBy: z
    .union([z.string().length(0), z.string()])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export const AccountDetailsSchema = z.object({
  name: z.string().min(5, "Full name must be at least 5 characters long"),
  alias: z
    .union([
      z
        .string("Alias must be either blank or 5 characters minimum.")
        .length(0, "Alias must be either blank or 5 characters minimum."),
      z.string().min(5),
    ])
    .optional(),
});

export const RoleRequestSchema = z.object({
  role: z.enum([ROLES.MEMBER, ROLES.MODERATOR, ROLES.ADMIN]),
});
