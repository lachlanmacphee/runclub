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
  alias: string;
  updated: string;
  username: string;
  verified: boolean;
};

export type GroupRun = {
  id: string;
  date: string;
  location: string;
  conditions?: string;
  isComplete: boolean;
  created: string;
  updated: string;
};

export type Participant = {
  waiver_id: string;
  position?: number;
  id?: string;
  group_run_id: string;
  name: string;
  distance: number;
  time_seconds?: number;
  bib: number;
  is_paid: boolean;
  is_new: boolean;
  created?: string;
};

export type Member = {
  waiver_id: string;
  user_id?: string;
  name: string;
};

export type RunDetails = {
  run: GroupRun;
  participants: Participant[];
  description: string;
  location: string;
};

export type Volunteer =
  | {
      run_date: Date;
      user_id?: string;
      expand: {
        user_id?: {
          id: string;
          name: string;
          alias?: string;
        };
      };
    }
  | {
      run_date: Date;
      waiver_id?: string;
      expand: {
        waiver_id?: {
          id: string;
          fname: string;
          lname: string;
          alias?: string;
        };
      };
    };

export type Waiver = {
  id: string;
  user_id?: string;
  email: string;
  fname: string;
  lname: string;
  alias?: string;
  suburb: string;
  postcode: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "Blank";
  age: "Blank" | "Under18" | "18-30" | "31-40" | "41-50" | "Above50";
  satisfiesAgeReq: "Over18" | "HavePermission";
  readTermsAndConditions: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  referredBy: string;
};

export type RoleRequest = {
  id: string;
  new_role: string;
  expand: {
    user_id: {
      id: string;
      name: string;
    };
  };
};
