import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Space, Table, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Vacancies, User, LevelSkill } from "../../types";
import { Header } from "../Base/Header";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./Vacancy.module.css";

const { Column } = Table;

export const MyVacancies: React.FC = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [skills, setSkills] = useState<{ [key: string]: LevelSkill | null }>({});
    const [error, setError] = useState<string>('');
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/auth/me/?token=${token}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setUserData(response.data);
            } catch (err) {
                setError("Не удалось загрузить данные профиля.");
                console.error("Ошибка при получении данных пользователя:", err);
            }
        };
        fetchUserData();
    }, [token]);

    // Fetch vacancies based on employer ID
    const { data: resources } = useQuery<Vacancies[]>({
        queryKey: ["resources"],
        queryFn: async () => {
            if (userData && userData.role === 2) {
                const res = await axios.get<Vacancies[]>(import.meta.env.VITE_BASE_URL + `api/vacancies/?id_employer=${userData.idbyrole}`);
                return res.data;
            }
            return [];
        },
        refetchInterval: 5000,
    });

    // Fetch skills data
    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/skills`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const skillsMap: { [key: number]: LevelSkill | null } = {};
                response.data.forEach((skill: LevelSkill) => {
                    skillsMap[skill.id] = skill;
                });
                setSkills(skillsMap);
            } catch (err) {
                setError("Не удалось загрузить данные навыков.");
                console.error("Ошибка при получении данных навыков:", err);
            }
        };
        fetchSkillsData();
    }, []);

    const { mutate: delVacancy } = useMutation({
        mutationFn: async (resource: Vacancies) => {
            try {
                await axios.delete(import.meta.env.VITE_BASE_URL + `api/vacancies/delete/${resource.id}`);
                message.success('Вакансия удалена');
            } catch (err) {
                console.error("Ошибка при удалении вакансии:", err);
                message.error('Ошибка при удалении вакансии');
            }
        }
    });

    const navigate = useNavigate();
    if (error) {
        return <div>{error}</div>;
    }

    return (
    <><div>
        <Header />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: "0", fontSize: "2rem", fontWeight: "600" }}>Мои вакансии</h1>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/new")}
                >
                    + Добавить вакансию
                </Button>
            </div>

            {(resources === undefined || resources.length === 0) ? (
                <div className={styles.vacancyCard} style={{ textAlign: "center", padding: "48px" }}>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                        У вас ещё нет вакансий
                    </p>
                    <Button
                        type="primary"
                        onClick={() => navigate("/new")}
                    >
                        Создать первую вакансию
                    </Button>
                </div>
            ) : (
                <Table<Vacancies> dataSource={resources || []} rowKey="id">
                    <Column
                        title="Должность"
                        dataIndex="post"
                        key="post"
                        render={(text) => <strong>{text}</strong>} />
                    <Column
                        title="Описание"
                        dataIndex="description"
                        key="description"
                        ellipsis />
                    <Column
                        title="Начало"
                        dataIndex="date_begin"
                        key="date_begin" />
                    <Column
                        title="Окончание"
                        dataIndex="date_end"
                        key="date_end" />
                    <Column
                        title="Оклад"
                        dataIndex="salary"
                        key="salary"
                        render={(text) => <span style={{ fontWeight: "600", color: "var(--success-color)" }}>{text}000 ₽</span>} />
                    <Column
                        title="Уровень навыков"
                        key="level"
                        render={(record: Vacancies) => {
                            const skill = skills[record.level_skill];
                            return skill ? skill.level : 'Не указан';
                        } } />
                    <Column
                        title="Действия"
                        key="action"
                        render={(record: Vacancies) => (
                            <Space>
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() => navigate(`/edit/${record.id}`)}
                                >
                                    Редактировать
                                </Button>
                                <Button
                                    danger
                                    onClick={() => delVacancy(record)}
                                >
                                    Удалить
                                </Button>
                            </Space>
                        )} />
                    <Column
                        title="Action"
                        key="actions"
            render={(_, record: Vacancies) => (
                <Space size="middle">
                    <Button onClick={() => navigate(`/${record.id}`)}>
                        Редактировать
                    </Button>
                    <Button onClick={() => delVacancy(record)}>
                        Удалить вакансию
                    </Button>
                    <Button onClick={() => navigate(`/vac-application/${record.id}`)}>
                        Получить заявки
                    </Button>
                </Space>
            )}/>
            </Table>
)}
        </div>
        </div>
    </>
    );
};
