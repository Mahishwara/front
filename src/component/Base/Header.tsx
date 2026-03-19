import { HeaderExtension } from "./HeaderExtensions";
import { Button} from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Header.module.css";
import { NavMenu } from "../NavMenu";
import { useUser, useCurrentUser } from "../../hooks/useUser";


export const Header: React.FC = () => {
    const navigate = useNavigate();
    useUser(); // Инициализируем загрузку пользователя
    const user = useCurrentUser();

    return (
        <HeaderExtension>
            <div className={styles.headerContent}>
                <div className={styles.navItems}>
                    <NavMenu />
                </div>
                <Button
                    className={`${styles.headerButton} ${styles.logoutButton}`}
                    onClick={async () => {
                        Cookies.remove('token');
                        navigate("/profile");
                    }}
                >
                    {user ? 'Выйти из аккаунта' : 'Войти'}
                </Button>
            </div>
		</HeaderExtension>
    );
}