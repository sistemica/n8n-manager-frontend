import { 
  Database, 
  Table2, 
  FileQuestion, 
  HardDrive, 
  BarChart2, 
  FileBarChart, 
  LineChart, 
  Activity,
  Settings,
  Sliders,
  Users,
  Shield,
  Server,
  History,
  Lock,
  Key,
  Mail,
  Workflow,
  Webhook
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItemType = 'link' | 'title' | 'dynamic';

export interface BaseNavItem {
  id: string;
  type: NavItemType;
  label: string;
}

export interface NavLink extends BaseNavItem {
  type: 'link';
  icon: LucideIcon;
  path: string;
}

export interface NavTitle extends BaseNavItem {
  type: 'title';
}

export interface NavDynamic extends BaseNavItem {
  type: 'dynamic';
  loadItems: () => Promise<NavLink[]>;
}

export interface MainNavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  subItems: (NavLink | NavTitle | NavDynamic)[];
}

const navigation: MainNavItem[] = [
  {
    id: 'n8n',
    icon: Workflow,
    label: 'nav.n8n',
    path: '/app/n8n',
    subItems: [
      {
        type: 'title',
        id: 'n8n-management',
        label: 'nav.n8nManagement'
      },
      {
        type: 'link',
        id: 'instances',
        icon: Server,
        label: 'nav.instances',
        path: '/app/n8n/instances'
      },
      {
        type: 'title',
        id: 'webhooks-section',
        label: 'nav.webhooks'
      },
      {
        type: 'dynamic',
        id: 'webhooks',
        label: 'nav.webhooks',
        loadItems: async () => {
          const pb = (await import('../lib/pocketbase')).default;
          try {
            const { items } = await pb.collection('instances').getList(1, 50, {
              sort: 'host',
              filter: 'availability_status = true'
            });
            return items.map(instance => ({
              type: 'link' as const,
              id: `webhook-${instance.id}`,
              icon: Webhook,
              label: instance.host.replace(/^https?:\/\//, ''),
              path: `/app/n8n/webhooks/${instance.id}`
            }));
          } catch (error) {
            console.error('Error loading instances:', error);
            return [];
          }
        }
      }
    ]
  },
  {
    id: 'database',
    icon: Database,
    label: 'nav.database',
    path: '/app/database',
    subItems: [
      {
        type: 'title',
        id: 'data-management',
        label: 'nav.dataManagement'
      },
      {
        type: 'link',
        id: 'tables',
        icon: Table2,
        label: 'nav.tables',
        path: '/app/database/tables'
      },
      {
        type: 'link',
        id: 'queries',
        icon: FileQuestion,
        label: 'nav.queries',
        path: '/app/database/queries'
      },
      {
        type: 'title',
        id: 'data-storage',
        label: 'nav.dataStorage'
      },
      {
        type: 'link',
        id: 'backups',
        icon: HardDrive,
        label: 'nav.backups',
        path: '/app/database/backups'
      },
      {
        type: 'link',
        id: 'history',
        icon: History,
        label: 'nav.history',
        path: '/app/database/history'
      }
    ]
  },
  {
    id: 'statistics',
    icon: BarChart2,
    label: 'nav.statistics',
    path: '/app/statistics',
    subItems: [
      {
        type: 'title',
        id: 'reports-section',
        label: 'nav.reportsSection'
      },
      {
        type: 'link',
        id: 'reports',
        icon: FileBarChart,
        label: 'nav.reports',
        path: '/app/statistics/reports'
      },
      {
        type: 'link',
        id: 'analytics',
        icon: LineChart,
        label: 'nav.analytics',
        path: '/app/statistics/analytics'
      },
      {
        type: 'title',
        id: 'monitoring',
        label: 'nav.monitoring'
      },
      {
        type: 'link',
        id: 'metrics',
        icon: Activity,
        label: 'nav.metrics',
        path: '/app/statistics/metrics'
      },
      {
        type: 'link',
        id: 'server',
        icon: Server,
        label: 'nav.server',
        path: '/app/statistics/server'
      }
    ]
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'nav.settings',
    path: '/app/settings',
    subItems: [
      {
        type: 'title',
        id: 'manage',
        label: 'nav.manage'
      },
      {
        type: 'link',
        id: 'preferences',
        icon: Sliders,
        label: 'nav.preferences',
        path: '/app/settings/preferences'
      },
      {
        type: 'link',
        id: 'users',
        icon: Users,
        label: 'nav.users',
        path: '/app/settings/users'
      },
      {
        type: 'title',
        id: 'security-settings',
        label: 'nav.securitySettings'
      },
      {
        type: 'link',
        id: 'security',
        icon: Shield,
        label: 'nav.security',
        path: '/app/settings/security'
      },
      {
        type: 'link',
        id: 'authentication',
        icon: Lock,
        label: 'nav.authentication',
        path: '/app/settings/authentication'
      },
      {
        type: 'link',
        id: 'api-keys',
        icon: Key,
        label: 'nav.apiKeys',
        path: '/app/settings/api-keys'
      },
      {
        type: 'title',
        id: 'notifications',
        label: 'nav.notifications'
      },
      {
        type: 'link',
        id: 'email',
        icon: Mail,
        label: 'nav.email',
        path: '/app/settings/email'
      }
    ]
  }
];

export default navigation;