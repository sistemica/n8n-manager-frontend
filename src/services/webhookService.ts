import pb from '../lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import i18n from '../lib/i18n';

export interface Webhook {
  id: string;
  collectionId: string;
  collectionName: string;
  instance: string;
  workflow_name: string;
  workflow_id: string;
  webhook_url: string;
  methods: string; // JSON array
  options: string; // JSON
  parameters: string; // JSON
  auth_type: string;
}

const WEBHOOKS_COLLECTION = 'webhooks';

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

export async function getWebhooks(instanceId: string, page: number = 1, perPage: number = 50): Promise<{
  items: Webhook[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const records = await pb.collection(WEBHOOKS_COLLECTION).getList(page, perPage, {
      filter: `instance = "${instanceId}"`,
      sort: 'webhook_url',
    });
    
    return {
      items: records.items as Webhook[],
      totalItems: records.totalItems,
      totalPages: records.totalPages,
    };
  } catch (error) {
    handleError(error);
  }
}