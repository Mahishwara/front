import axios from "axios";
import Cookies from 'js-cookie';
import { Header } from "../Base/Header";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employer, Student, User, LevelSkill } from "../../types";
import styles from "./Auth.module.css";

export const Profile: React.FC = () => {
    const [userData, setUserData] = useState<User>();
    const [studentData, setStudentData] = useState<Student>();
    const [employerData, setEmployerData] = useState<Employer>();
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
                console.log("Полученные данные пользователя:", response.data.dta);
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
                const response = await axios.get<LevelSkill[]>( import.meta.env.VITE_BASE_URL + `api/skills`, {
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

    
    useEffect(() => {
        if (userData) {
            if (userData.role === 1) {
                const fetchStudentData = async () => {
                    try {
                        const response = await axios({
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            url: import.meta.env.VITE_BASE_URL + `api/students/${userData.idbyrole}`
                        });
                        setStudentData(response.data.data);
                    } catch (err) {
                        setError('Не удалось загрузить данные студента.');
                        console.error("Ошибка при получении данных студента:", err);
                    }
                };
                fetchStudentData();
            }
            if (userData.role === 2) {
                const fetchEmployerData = async () => {
                    try {
                        const response = await axios({
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            url: import.meta.env.VITE_BASE_URL + `api/employers/${userData.idbyrole}`
                        });
                        setEmployerData(response.data.data);
                    } catch (err) {
                        setError('Не удалось загрузить данные работодателя.');
                        console.error("Ошибка при получении данных работодателя:", err);
                    }
                };
                fetchEmployerData();
            }
        }
    }, [userData]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Загрузка...</div>;
    }

    
    const getSkillLevelName = (id: number) => {
        const skill = skills.find(skill => skill.id === id);
        return skill ? skill.level : 'Не указан'; 
    };

    const handleStudentRedirect = () => {
        navigate('/student-data'); 
    };

    const handleEmployerRedirect = () => {
        navigate('/employer-data'); 
    };

    return (
        <div>
            <Header />
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
                {studentData && (
                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.profileAvatar}>СТ</div>
                            <div className={styles.profileInfo}>
                                <h2>{studentData.fio}</h2>
                                <p>{studentData.post}</p>
                            </div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>ФИО</div>
                            <div className={styles.profileFieldValue}>{studentData.fio}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Должность</div>
                            <div className={styles.profileFieldValue}>{studentData.post}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Уровень навыков</div>
                            <div className={styles.profileFieldValue}>{getSkillLevelName(studentData.level_skill)}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Специальность</div>
                            <div className={styles.profileFieldValue}>{studentData.speciality}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Курс</div>
                            <div className={styles.profileFieldValue}>{studentData.course}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Email</div>
                            <div className={styles.profileFieldValue}>{userData.email}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Телефон</div>
                            <div className={styles.profileFieldValue}>{userData.phone_number}</div>
                        </div>
                    </div>
                )}

                {employerData && (
                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.profileAvatar}>РБ</div>
                            <div className={styles.profileInfo}>
                                <h2>{employerData.name}</h2>
                                <p>{employerData.organization}</p>
                            </div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>ФИО</div>
                            <div className={styles.profileFieldValue}>{employerData.name}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Организация</div>
                            <div className={styles.profileFieldValue}>{employerData.organization}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Описание</div>
                            <div className={styles.profileFieldValue}>{employerData.description}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Email</div>
                            <div className={styles.profileFieldValue}>{userData.email}</div>
                        </div>

                        <div className={styles.profileField}>
                            <div className={styles.profileFieldLabel}>Телефон</div>
                            <div className={styles.profileFieldValue}>{userData.phone_number}</div>
                        </div>
                    </div>
                )}

                {!employerData && !studentData && (
                    <div className={styles.authCard} style={{ textAlign: "center" }}>
                        <h2 style={{ marginBottom: "24px" }}>Выберите роль</h2>
                        <p style={{ marginBottom: "32px", color: "var(--text-secondary)" }}>
                            Для продолжения работы выберите одну из ролей
                        </p>
                        <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
                            <Button 
                                size="large"
                                onClick={handleStudentRedirect}
                            >
                                Выбрать роль студента
                            </Button>
                            <Button 
                                size="large"
                                onClick={handleEmployerRedirect}
                            >
                                Выбрать роль работодателя
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
