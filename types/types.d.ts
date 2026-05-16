export interface User {
  id: string;
  name: string;
  avatar: string;
  roles: string[];
  isHost: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  roles: string[];
  createdAt: number;
}
