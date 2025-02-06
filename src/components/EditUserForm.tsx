import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, User as UserIcon, Lock, X } from 'lucide-react';
import { createUser, updateUser, deleteUser } from '../services/userService';
import type { User } from '../services/userService';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import ConfirmModal from './ui/ConfirmModal';
import useToast from '../hooks/useToast';
import { isDarkTheme } from '../lib/theme';

interface EditUserFormProps {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

export default function EditUserForm({ user, onClose, onSave }: EditUserFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(user?.verified || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (user) {
      setIsDirty(
        name !== user.name ||
        email !== user.email ||
        verified !== user.verified ||
        password.length > 0
      );
    }
  }, [name, email, verified, password, user]);

  const isValidNewUser = 
    name.trim() !== '' && 
    email.trim() !== '' && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.trim() !== '';

  const isSaveEnabled = user ? isDirty : isValidNewUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaveEnabled) return;

    setLoading(true);
    setError(null);

    try {
      if (user) {
        const updates: Record<string, any> = {};
        if (name !== user.name) updates.name = name;
        if (email !== user.email) updates.email = email;
        if (verified !== user.verified) updates.verified = verified;
        if (password) {
          updates.password = password;
          updates.passwordConfirm = password;
        }
        await updateUser(user.id, updates);
        onClose();
        setTimeout(() => {
          showToast(t('common.updateSuccess'), 'success');
          onSave();
        }, 300);
      } else {
        await createUser({
          email,
          name,
          password,
          passwordConfirm: password,
          verified,
        });
        onClose();
        setTimeout(() => {
          showToast(t('common.createSuccess'), 'success');
          onSave();
        }, 300);
      }
    } catch (err: any) {
      console.error('Error saving user:', err);
      setError(err.message || t('users.updateError'));
      showToast(err.message || t('users.updateError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      setShowDeleteConfirm(false);
      onClose();
      setTimeout(() => {
        showToast(t('common.deleteSuccess'), 'success');
        onSave();
      }, 300);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || t('common.deleteError'));
      showToast(err.message || t('common.deleteError'), 'error');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal onClose={onClose} position="right" width="w-[480px]">
        <div className="h-full flex flex-col">
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkTheme ? 'border-dark-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {user ? t('users.editUser') : t('users.addUser')}
            </h2>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDarkTheme 
                  ? 'text-dark-200 hover:bg-dark-700 hover:text-white active:bg-dark-600' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200'
              }`}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('users.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<UserIcon className="h-5 w-5" />}
                required={!user}
              />

              <Input
                label={t('users.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-5 w-5" />}
                required={!user}
              />

              <Input
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-5 w-5" />}
                placeholder={user ? t('users.passwordPlaceholder') : ''}
                required={!user}
              />

              <div className="mt-8">
                <label className={`flex items-center space-x-3 cursor-pointer ${
                  isDarkTheme ? 'text-dark-100' : 'text-gray-700'
                }`}>
                  <button
                    type="button"
                    onClick={() => setVerified(!verified)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      verified
                        ? isDarkTheme
                          ? 'bg-green-500'
                          : 'bg-green-600'
                        : isDarkTheme
                          ? 'bg-dark-600'
                          : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        verified ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {verified ? t('users.verified') : t('users.unverified')}
                  </span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className={`p-6 border-t ${
            isDarkTheme ? 'border-dark-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              {user && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                >
                  {t('common.delete')}
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={loading || !isSaveEnabled}
                loading={loading}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {showDeleteConfirm && (
        <ConfirmModal
          title={t('common.confirmDelete')}
          message={t('common.confirmDeleteMessage')}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={isDeleting}
        />
      )}
    </>
  );
}