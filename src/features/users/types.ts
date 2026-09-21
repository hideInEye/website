import type { PostSummary } from "@/features/articles";

export interface IUserCommentSummary {
  id: string;
  content: string;
  createdAt: string;
  post: { title: string; slug: string };
}

export interface IPublicProfile {
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  comments: IUserCommentSummary[];
}

export interface IPrivateProfile extends Omit<IPublicProfile, "comments"> {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
  emailVerifiedAt?: string | null;
}

export interface IMyComment extends IUserCommentSummary {
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
}

export interface IAccountOverview {
  profile: IPrivateProfile;
  bookmarks: PostSummary[];
  comments: IMyComment[];
}

export interface IProfileMutation {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}
