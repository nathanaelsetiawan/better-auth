export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    createdAt: Date;
    metadata?: string | null;
  }

export interface OrganizationWithMembers extends Organization {
    members: {
      id: string;
      role: string;
      userId: string;
      organizationId: string;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    }[];
}

export interface MemberWithUser {
    id: string;
    role: string;
    userId?: string;
    organizationId?: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}