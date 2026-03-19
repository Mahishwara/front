import { useEffect, useState, useCallback, useContext, createContext, type ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { User, UserRole } from '../types';

/**
 * Определяет роль пользователя на основе его профилей
 */
export const getUserRole = (user: User | null): UserRole => {
	if (!user) return 'guest';
	
	if (user.role === 0) return 'student';
    if (user.role === 1) return 'employer';
	if (user.role === 2) return 'admin';
	
	return 'guest';
};

type UserContextType = {
	user: User | null;
	role: UserRole;
	isLoading: boolean;
	refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Hook для получения и управления текущим пользователем
 */
export const useUser = () => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [role, setRole] = useState<UserRole>('guest');

	const fetchUser = useCallback(async () => {
		const token = Cookies.get('token');
		if (!token) {
			setUser(null);
			setRole('guest');
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.get<User>(
				`${import.meta.env.VITE_BASE_URL}api/auth/me/?token=${token}`
			);
			
			if (response.data) {
				setUser(response.data);
				const userRole = getUserRole(response.data);
				setRole(userRole);
			}
		} catch (error) {
			console.error('Failed to fetch user:', error);
			setUser(null);
			setRole('guest');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return { user, role, isLoading, refetch: fetchUser };
};

/**
 * Hook для получения роли пользователя
 */
export const useUserRole = (): UserRole => {
	const { role } = useUser();
	return role;
};

/**
 * Hook для получения текущего пользователя
 */
export const useCurrentUser = (): User | null => {
	const { user } = useUser();
	return user;
};
