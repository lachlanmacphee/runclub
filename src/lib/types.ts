import { z } from "zod";
import { WaiverFormSchema } from "./schemas";

export type User = {
  avatar: string;
  role: "member" | "moderator" | "admin";
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
};

export type GroupRun = {
  id: string;
  date: string;
  location: string;
  isComplete: boolean;
  created: string;
  updated: string;
};

export type Participant = {
  position?: number;
  id?: string;
  user_id?: string;
  group_run_id: string;
  name: string;
  distance: number;
  time_seconds?: number;
  bib: number;
  is_paid: boolean;
  is_new: boolean;
};

export type Member = {
  user_id?: string;
  name: string;
};

export type RunDetails = {
  run: GroupRun;
  participants: Participant[];
  description: string;
  location: string;
};

export type Waiver = z.infer<typeof WaiverFormSchema>;
