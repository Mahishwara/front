import type { NavItem, UserRole } from '../types';

/**
 * Определяет доступные пункты меню в зависимости от роли пользователя
 */
export const getNavMenuByRole = (role: UserRole): NavItem[] => {
	const navMenus: Record<UserRole, NavItem[]> = {
		student: [
			{ label: 'Главная', path: '/' },
			{ label: 'Мои заявки', path: '/applications' },
			{ label: 'Профиль', path: '/profile' },
		],
		employer: [
			{ label: 'Главная', path: '/' },
			{ label: 'Управление вакансиями', path: '/my-vacancies' },
			{ label: 'Заявки на вакансии', path: '/applications' },
			{ label: 'Профиль', path: '/profile' },
		],
		admin: [
			{ label: 'Главная', path: '/' },
			{ label: 'Профиль', path: '/profile' },
		],
		guest: [
			{ label: 'Главная', path: '/' },
			{ label: 'Профиль', path: '/profile' },
		],
	};

	return navMenus[role] || navMenus.guest;
};
