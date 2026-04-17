export function sharedTypes(): string {
  return 'shared-types';
}

export type UserRole = 'admin' | 'user';

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
}
