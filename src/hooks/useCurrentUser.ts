import { useAuth } from './useAuth';
import { userService } from '../modules/core/services/user.service';
import { UserProfile } from '../modules/core/types/core.types';

export function useCurrentUser() {
  const { user, setUser, isAuthenticated, isLoading } = useAuth();

  const updateProfile = async (data: Partial<UserProfile>) => {
    const response = await userService.updateProfile(data);
    if (response.data && user) {
      setUser({
        ...user,
        ...response.data,
      });
    }
    return response;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    updateProfile,
    roles: user?.roles || [],
    permissions: user?.permissions || [],
    userType: user?.userType,
  };
}
