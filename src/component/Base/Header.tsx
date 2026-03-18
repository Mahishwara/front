import { HeaderExtension } from "./HeaderExtensions";
import { Button} from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Header.module.css";


export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <HeaderExtension>
            <div className={styles.headerContent}>
                <div className={styles.navItems}>
                    <Button
                        className={styles.headerButton}
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Главная
                    </Button>
                    
                    <Button
                        className={styles.headerButton}
                        onClick={() => {
                            navigate("/my-vacancies");
                        }}
                    >
                        Управление вакансиями
                    </Button>
                    <Button
                        className={styles.headerButton}
                        onClick={() => {
                            navigate("/applications");
                        }}
                    >
                        Мои заявки
                    </Button>
                    <Button
                        className={styles.headerButton}
                        onClick={() => {
                            navigate('/profile')
                        }}
                    >
                        Профиль
                    </Button>
                </div>
                <Button
                    className={`${styles.headerButton} ${styles.logoutButton}`}
                    onClick={async () => {
                        Cookies.remove('token');
                        navigate("/profile");
                    }}
                >
                    Выйти из аккаунта
                </Button>
            </div>
			</HeaderExtension>
    );
}