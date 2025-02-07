import { ClientResponseError } from 'pocketbase';
import i18n from '../lib/i18n';

export function handleApiError(error: any): never {
  if (error instanceof ClientResponseError) {
    if (error.response.code === 400) {
      const firstError = Object.values(error.response.data)[0];
      throw new Error(i18n.t('common.validationError', { 
        error: Array.isArray(firstError) ? firstError[0] : String(firstError) 
      }));
    }
    throw new Error(i18n.t('common.serverError'));
  }
  throw new Error(i18n.t('common.unexpectedError'));
}