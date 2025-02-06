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
  Mail
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItemType = 'link' | 'title';

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

export interface MainNavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  subItems: (NavLink | NavTitle)[];
}

const navigation: MainNavItem[] = [
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