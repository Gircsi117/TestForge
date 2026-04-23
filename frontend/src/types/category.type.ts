export type Category = {
  id: string;
  name: string;
  description: string | null;
  shareCode: string | null;
  createdBy: string;
  creator: { id: string; name: string };
  isOwner: boolean;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShareUser = {
  userId: string;
  name: string;
  canEdit: boolean;
};

export type ShareInfo = {
  code: string | null;
  users: ShareUser[];
};
