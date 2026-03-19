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
                <Button
					onClick={() => {
						navigate("/");
					}}
				>
					Главная
				</Button>
				
				<Button
					onClick={() => {
						navigate("/my-vacancies")
						;
					}}
				>
					Управление вакансиями
				</Button>
				<Button
					onClick={() => {
						navigate("/applications")
						;
					}}
				>
					Мои заявки
				</Button>
				<Button
					onClick={() => {
					navigate('/profile')
					}}
				>
					Профиль
				</Button>
				<Button
					onClick={async () => {
						Cookies.remove('token');
						navigate("/profile");
					}}
				>
					Выйти из аккаунта
				</Button>
			</HeaderExtension>
    );
}