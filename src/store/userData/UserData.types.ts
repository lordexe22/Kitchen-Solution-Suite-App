/* src/store/UserData.types.ts */
// #type UserType - 'admin' | 'employee' | 'guest' | 'ownership' | null
export type UserType = 'admin' | 'employee' | 'guest' | 'ownership' | null;
// #end-type
// #type UserState - 'pending' | 'active' | 'suspended' | null
export type UserState = 'pending' | 'active' | 'suspended' | null;
// #end-type
// #interface User - Complete user entity
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  type: UserType;
  belongToBranchId: number | null;
  belongToCompanyId: number | null;
  state: UserState;
}
// #end-interface
// #type EditableUserFields - Fields that can be updated by client
export type EditableUserFields = Pick<User, 'firstName' | 'lastName' | 'email' | 'imageUrl'>;
// #end-type
// #interface UserDataStore
export interface UserDataStore {
  // #v-field - user entity
  user: User | null;
  // #end-v-field
  // #v-field - hydration state
  isHydrated: boolean;
  // #end-v-field
  // #f-field update - Update editable user fields only (client side)
  update: (partial: Partial<EditableUserFields>) => void;
  // #end-f-field
  // #f-field getUserDataFromServer - Get and apply user data from the server
  getUserDataFromServer: (user: User | null) => void;
  // #end-f-field
  // #f-field logout - Clear user data when logging out
  logout: () => void;
  // #end-f-field
};
// #end-interface

// #section validation helpers
export const allowedTypes = ['admin', 'employee', 'guest', 'ownership'] as const;
export const allowedStates = ['pending', 'active', 'suspended'] as const;

const isPositiveInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n > 0;
const isNullablePositiveInt = (n: unknown): n is number | null => n === null || isPositiveInt(n);
const normalizeString = (s: unknown): string => (typeof s === 'string' ? s.trim() : '');
const normalizeEmail = (s: unknown): string => normalizeString(s).toLowerCase();
const normalizeImageUrl = (s: unknown): string | null => {
  if (s === null || s === undefined) return null;
  const v = normalizeString(s);
  return v.length === 0 ? null : v;
};

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; reason: string };

// Validate a fully built user
export const validateAndNormalizeUser = (candidate: Partial<User>): ValidationResult<User> => {
  const id = candidate.id;
  const firstName = normalizeString(candidate.firstName);
  const lastName = normalizeString(candidate.lastName);
  const email = normalizeEmail(candidate.email);
  const type = candidate.type;
  const state = candidate.state;
  const belongToCompanyId = candidate.belongToCompanyId ?? null;
  const belongToBranchId = candidate.belongToBranchId ?? null;
  const imageUrl = normalizeImageUrl(candidate.imageUrl ?? null);

  if (!isPositiveInt(id)) return { ok: false, reason: 'id must be a positive integer' };
  if (!firstName) return { ok: false, reason: 'firstName is required' };
  if (!lastName) return { ok: false, reason: 'lastName is required' };
  if (!email) return { ok: false, reason: 'email is required' };
  if (type === null || type === undefined || !allowedTypes.includes(type)) return { ok: false, reason: 'type is invalid' };
  if (state === null || state === undefined || !allowedStates.includes(state)) return { ok: false, reason: 'state is invalid' };
  if (!isNullablePositiveInt(belongToCompanyId)) return { ok: false, reason: 'belongToCompanyId must be null or positive integer' };
  if (!isNullablePositiveInt(belongToBranchId)) return { ok: false, reason: 'belongToBranchId must be null or positive integer' };

  if (type === 'employee') {
    if (belongToCompanyId === null || belongToBranchId === null) {
      return { ok: false, reason: 'employee must have belongToCompanyId and belongToBranchId' };
    }
  }

  const normalized: User = {
    id,
    firstName,
    lastName,
    email,
    imageUrl,
    type: type as Exclude<UserType, null>,
    belongToBranchId,
    belongToCompanyId,
    state: state as Exclude<UserState, null>,
  };

  return { ok: true, value: normalized };
};

// Validate and normalize only editable fields (client-side updates)
export const validateAndNormalizeEditableFields = (
  partial: Partial<EditableUserFields>,
  existing: User | null
): ValidationResult<User> => {
  if (!existing) return { ok: false, reason: 'cannot update editable fields when user is null' };

  const firstName = 'firstName' in partial ? normalizeString(partial.firstName) : existing.firstName;
  const lastName = 'lastName' in partial ? normalizeString(partial.lastName) : existing.lastName;
  const email = 'email' in partial ? normalizeEmail(partial.email) : existing.email;
  const imageUrl = 'imageUrl' in partial ? normalizeImageUrl(partial.imageUrl) : existing.imageUrl;

  if (!firstName) return { ok: false, reason: 'firstName cannot be empty' };
  if (!lastName) return { ok: false, reason: 'lastName cannot be empty' };
  if (!email) return { ok: false, reason: 'email is required' };

  const updated: User = {
    ...existing,
    firstName,
    lastName,
    email,
    imageUrl,
  };

  return { ok: true, value: updated };
};
// #end-section