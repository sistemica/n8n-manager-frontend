import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Search, X, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { getUsers } from '../services/userService';
import type { User } from '../services/userService';
import { isDarkTheme } from '../lib/theme';
import Table from '../components/Table';
import TableSkeleton from '../components/TableSkeleton';
import EditUserForm from '../components/EditUserForm';
import LoadingBar from '../components/LoadingBar';

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchUsers = async () => {
      try {
        const { items } = await getUsers();
        if (!ignore) {
          setUsers(items);
          setError(null);
        }
      } catch (error: any) {
        if (!ignore) {
          console.error('Error fetching users:', error);
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: t('users.name'),
      render: (user: User) => (
        <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
          {user.name || '-'}
        </span>
      ),
    },
    {
      key: 'email',
      header: t('users.email'),
    },
    {
      key: 'status',
      header: t('users.status'),
      render: (user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.verified
            ? isDarkTheme
              ? 'bg-green-500/20 text-green-400'
              : 'bg-green-100 text-green-800'
            : isDarkTheme
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user.verified ? t('users.verified') : t('users.unverified')}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: t('users.lastLogin'),
      render: (user: User) => user.lastLogin ? format(new Date(user.lastLogin), 'PPp') : '-',
    },
    {
      key: 'created',
      header: t('users.created'),
      render: (user: User) => format(new Date(user.created), 'PPp'),
    },
  ];

  const handleUserSave = async () => {
    setLoading(true);
    try {
      const { items } = await getUsers();
      setUsers(items);
      setSelectedUser(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error refreshing users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingBar />}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              isDarkTheme ? 'text-dark-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.searchPlaceholder')}
              className={`w-full pl-9 pr-8 py-2 ${
                isDarkTheme 
                  ? 'bg-dark-700/50 text-white placeholder-dark-400' 
                  : 'bg-white/50 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all rounded-lg`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                  isDarkTheme
                    ? 'hover:bg-dark-600 text-dark-300'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkTheme
                ? 'bg-white/50 text-gray-900 hover:bg-white'
                : 'bg-dark-700 text-white hover:bg-dark-700/50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t('users.addUser')}</span>
          </button>
        </div>

        {loading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : (
          <Table
            columns={columns}
            data={filteredUsers}
            loading={loading}
            error={error}
            emptyMessage={t('users.noResults')}
            onRowClick={setSelectedUser}
          />
        )}
      </div>

      <AnimatePresence>
        {(selectedUser || showAddForm) && (
          <EditUserForm
            user={selectedUser}
            onClose={() => {
              setSelectedUser(null);
              setShowAddForm(false);
            }}
            onSave={handleUserSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}