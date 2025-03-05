import pb from '../lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import i18n from '../lib/i18n';

export interface N8nInstance {
  id: string;
  collectionId: string;
  collectionName: string;
  host: string;
  ignore_ssl_errors: boolean;
  api_key: string;
  check_interval_mins: number;
  last_check: string;
  availability_status: boolean;
  availability_note: string;
  workflows_active: number;
  workflows_inactive: number;
  webhooks_active: number;
  webhooks_inactive: number;
}

export interface CreateN8nInstanceData {
  host: string;
  ignore_ssl_errors: boolean;
  api_key: string;
  check_interval_mins: number;
}

export interface UpdateN8nInstanceData {
  host?: string;
  ignore_ssl_errors?: boolean;
  api_key?: string;
  check_interval_mins?: number;
}

const N8N_COLLECTION = 'instances';

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

export async function getInstances(page: number = 1, perPage: number = 50): Promise<{
  items: N8nInstance[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const records = await pb.collection(N8N_COLLECTION).getList(page, perPage, {
      sort: '-host',
    });
    
    return {
      items: records.items as N8nInstance[],
      totalItems: records.totalItems,
      totalPages: records.totalPages,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function createInstance(data: CreateN8nInstanceData): Promise<N8nInstance> {
  try {
    const record = await pb.collection(N8N_COLLECTION).create(data);
    return record as N8nInstance;
  } catch (error) {
    handleError(error);
  }
}

export async function updateInstance(id: string, data: UpdateN8nInstanceData): Promise<N8nInstance> {
  try {
    const record = await pb.collection(N8N_COLLECTION).update(id, data);
    return record as N8nInstance;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteInstance(id: string): Promise<void> {
  try {
    await pb.collection(N8N_COLLECTION).delete(id);
  } catch (error) {
    handleError(error);
  }
}