export type User = {
  avatar: string;
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

export type Participant = {
  user_id?: string;
  group_run_id: string;
  name: string;
  distance: number;
  time_seconds?: number;
  bib: number;
};
