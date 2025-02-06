import { Navigate } from 'react-router-dom';
import pb from '../lib/pocketbase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!pb.authStore.isValid) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}