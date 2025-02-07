import { format, formatDistance } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import i18n from './i18n';

const locales = {
  en: enUS,
  de: de,
};

type DateLocale = keyof typeof locales;

export function formatDate(date: string | Date | null): string {
  if (!date) return '-';
  const locale = locales[i18n.language as DateLocale] || enUS;
  return format(new Date(date), 'PPp', { locale });
}

export function formatRelative(date: string | Date | null): string {
  if (!date) return '-';
  const locale = locales[i18n.language as DateLocale] || enUS;
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale,
  });
}