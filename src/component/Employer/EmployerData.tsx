import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User, LevelSkill } from '../../types';
import { Header } from '../Base/Header';
import styles from '../User/DataForms.module.css';

export const EmployerData = () => {
    const [userData, setUserData] = useState<User>();
    const [skills, setSkills] = useState<LevelSkill[]>([]);
    const [error, setError] = useState<string>('');
    const token = Cookies.get('token');
    const navigate = useNavigate();

   
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    url: import.meta.env.VITE_BASE_URL + `api/auth/me/?token=${token}`
                });
                setUserData(response.data);
            } catch (err) {
                setError("Не удалось загрузить данные профиля.");
                console.error("Ошибка при получении данных пользователя:", err);
            }
        };

        fetchUserData();
    }, [token]);


    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get<LevelSkill[]>(import.meta.env.VITE_BASE_URL + `api/skills`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setSkills(response.data); // Assuming response.data is an array of LevelSkill
            } catch (err) {
                setError('Не удалось загрузить данные уровней навыков.');
                console.error("Ошибка при получении данных навыков:", err);
            }
        };
        fetchSkills();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Загрузка...</div>;
    }

    const onFinish = async (values: any) => {
        try {
            values.user_id = userData.id;
            await axios.post(import.meta.env.VITE_BASE_URL + `api/employers/add/?token=${token}`, values);
            
            message.success('Данные успешно отправлены!');
            navigate('/profile');
        } catch (error) {
            message.error('Произошла ошибка при отправке данных.');
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.dataContainer}>
                <div className={styles.dataHeader}>
                    <h1 className={styles.dataTitle}>Профиль работодателя</h1>
                    <p className={styles.dataSubtitle}>Заполните информацию о компании</p>
                </div>
                <Form
                    name="employer_data"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Личные данные</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>ФИО</label>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
                                >
                                    <Input className={styles.formInput} placeholder="Иван Иванов" />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Информация о компании</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Название организации</label>
                                <Form.Item
                                    name="organization"
                                    rules={[{ required: true, message: 'Пожалуйста, введите название организации!' }]}
                                >
                                    <Input className={styles.formInput} placeholder="ООО Компания" />
                                </Form.Item>
                            </div>
                        </div>

                        <div className={styles.formRow + ' ' + styles.full}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Описание компании</label>
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'Пожалуйста, введите описание!' }]}
                                >
                                    <Input.TextArea 
                                        className={styles.formTextarea}
                                        placeholder="Опишите вашу компанию..."
                                        rows={4} 
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Button onClick={() => navigate('/profile')}>Отмена</Button>
                        <Button type="primary" htmlType="submit" className={styles.buttonPrimary}>
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EmployerData;
