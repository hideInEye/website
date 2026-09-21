export interface ICommentAuthor {
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  user: ICommentAuthor;
  replies?: IComment[];
}

export interface ICommentMutationResult {
  id: string;
  moderationRequired: boolean;
}
