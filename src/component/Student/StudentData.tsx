import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Student, User, LevelSkill } from '../../types';
import { Header } from '../Base/Header';
import styles from '../User/DataForms.module.css';

export const StudentData = () => {
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
                setUserData(response.data.data);
            } catch (err) {
                setError('Не удалось загрузить данные профиля.');
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
                setSkills(response.data);
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

    const onFinish = async (values: Student) => {
        try {
            await axios.post(import.meta.env.VITE_BASE_URL + `api/students/add/?token=${token}`, values);
            message.success('Данные успешно отправлены!');
            navigate('/profile');
        } catch {
            message.error('Произошла ошибка при отправке данных.');
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.dataContainer}>
                <div className={styles.dataHeader}>
                    <h1 className={styles.dataTitle}>Профиль студента</h1>
                    <p className={styles.dataSubtitle}>Заполните информацию о себе</p>
                </div>
                <Form
                    name="student_data"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Основные данные</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>ФИО</label>
                                <Form.Item
                                    name="fio"
                                    rules={[{ required: true, message: 'Пожалуйста, введите ваше ФИО!' }]}
                                >
                                    <Input className={styles.formInput} placeholder="Иван Иванов" />
                                </Form.Item>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Должность</label>
                                <Form.Item
                                    name="post"
                                    rules={[{ required: true, message: 'Пожалуйста, введите вашу должность!' }]}
                                >
                                    <Input className={styles.formInput} placeholder="Frontend разработчик" />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Образование</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Специальность</label>
                                <Form.Item
                                    name="speciality"
                                    rules={[{ required: true, message: 'Пожалуйста, введите вашу специальность!' }]}
                                >
                                    <Input className={styles.formInput} placeholder="Информатика" />
                                </Form.Item>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Курс</label>
                                <Form.Item
                                    name="course"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите курс!' }]}
                                >
                                    <InputNumber min={1} max={5} className={styles.formInput} />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Профессиональные данные</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Уровень навыков</label>
                                <Form.Item
                                    name="level_skill"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите уровень навыков!' }]}
                                >
                                    <Select className={styles.formSelect} placeholder="Выберите уровень">
                                        {skills.map(skill => (
                                            <Select.Option key={skill.id} value={skill.id}>
                                                {skill.level}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>

                        <div className={styles.formRow + ' ' + styles.full}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Описание навыков</label>
                                <Form.Item
                                    name="ability"
                                    rules={[{ required: true, message: 'Пожалуйста, введите ваши навыки!' }]}
                                >
                                    <Input.TextArea 
                                        className={styles.formTextarea}
                                        placeholder="Опишите ваши основные навыки и опыт..." 
                                        rows={4}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Button onClick={() => navigate('/profile')}>Отмена</Button>
                        <Button htmlType="submit" className={styles.buttonPrimary}>
                            Сохранить
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default StudentData;
