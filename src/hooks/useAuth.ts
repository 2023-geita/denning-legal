import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UserRole } from '@prisma/client';

export function useAuth(requiredRole?: UserRole) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (!isLoading) {
      // If no session exists and we're not on the auth pages, redirect to signin
      if (!session && !router.pathname.startsWith('/auth/')) {
        router.push('/auth/signin');
      }
      
      // If a role is required and the user doesn't have it, redirect to home
      if (requiredRole && session?.user?.role !== requiredRole) {
        router.push('/');
      }
    }
  }, [session, isLoading, router, requiredRole]);

  return {
    session,
    isLoading,
    isAuthenticated,
    user: session?.user,
  };
}

export function useRequireAuth(requiredRole?: UserRole) {
  const auth = useAuth(requiredRole);
  
  if (auth.isLoading) {
    return { isLoading: true };
  }
  
  if (!auth.isAuthenticated) {
    return { isLoading: false, error: 'Not authenticated' };
  }
  
  if (requiredRole && auth.user?.role !== requiredRole) {
    return { isLoading: false, error: 'Insufficient permissions' };
  }
  
  return {
    isLoading: false,
    user: auth.user,
    session: auth.session,
  };
} 