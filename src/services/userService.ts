import pb from '../lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import i18n from '../lib/i18n';

export interface CreateUserData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  verified?: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  verified?: boolean;
}

export interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar: string;
  lastLogin?: string;
}

const USERS_COLLECTION = 'users';

function handleError(error: any): never {
  if (error instanceof ClientResponseError) {
    if (error.response.code === 400) {
      const firstError = Object.values(error.response.data)[0];
      throw new Error(i18n.t('common.validationError', { error: Array.isArray(firstError) ? firstError[0] : String(firstError) }));
    }
    throw new Error(i18n.t('common.serverError'));
  }
  throw new Error(i18n.t('common.unexpectedError'));
}

export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    const record = await pb.collection(USERS_COLLECTION).create({
      ...userData,
      emailVisibility: false,
      verified: userData.verified ?? false
    });
    return record as User;
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(userId: string, userData: UpdateUserData): Promise<User> {
  try {
    const record = await pb.collection(USERS_COLLECTION).update(userId, userData);
    return record as User;
  } catch (error) {
    handleError(error);
  }
}

export async function getUsers(page: number = 1, perPage: number = 50): Promise<{
  items: User[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const records = await pb.collection(USERS_COLLECTION).getList(page, perPage, {
      sort: '-created',
    });
    
    return {
      items: records.items as User[],
      totalItems: records.totalItems,
      totalPages: records.totalPages,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await pb.collection(USERS_COLLECTION).delete(userId);
  } catch (error) {
    handleError(error);
  }
}