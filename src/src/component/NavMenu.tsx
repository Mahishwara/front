import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUser';
import { getNavMenuByRole } from '../utils/navConfig';
import styles from './NavMenu.module.css';

export const NavMenu: React.FC = () => {
	const navigate = useNavigate();
	const role = useUserRole();
	const navItems = getNavMenuByRole(role);

	return (
		<div className={styles.navItems}>
			{navItems.map((item) => (
				<Button
					key={item.path}
					className={styles.headerButton}
					onClick={() => navigate(item.path)}
				>
					{item.label}
				</Button>
			))}
		</div>
	);
};
