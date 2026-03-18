import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, message, Table } from "antd";
import axios from "axios";
import React from "react";
import { User, Vacancies, LevelSkill } from "../../types";
import { Header } from "../Base/Header";
import { useEffect, useState, FC } from "react";
import Cookies from "js-cookie";
import styles from "./Vacancy.module.css";


const { Column } = Table;

export const VacancyList: FC = () => {
    const [userData, setUserData] = useState<User>();
    const [skills, setSkills] = useState<{ [key: string]: LevelSkill | null }>({});
    const [error, setError] = useState<string>('');
    const token = Cookies.get('token');

    // Fetch vacancies
    const { data: resources } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const res = await axios.get<Vacancies[]>(import.meta.env.VITE_BASE_URL + "api/vacancies");
            
            return res.data;
        },
        refetchInterval: 500000,
    });

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(import.meta.env.VITE_BASE_URL + `api/auth/me/?token=${token}`)
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/auth/me/?token=${token}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setUserData(response.data);
            } catch (err) {
                setError('Не удалось загрузить данные профиля.');
                console.error("Ошибка при получении данных пользователя:", err);
            }
        };
        fetchUserData();
    }, [token]);

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

    // Mutation for posting application
    const { mutate: postApplication } = useMutation({
        mutationFn: async (resource: Vacancies) => {
            if (userData && userData.student_id != null) {
                const applicationData = { "id_student": userData.student_id, "id_vacancy": resource.id };
                try {
                    const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/applications/?id_vacancy=${resource.id}&id_student=${userData.student_id}`);
                    if (response.data.length > 0) {
                        message.info('Вы уже подали заявку на данную вакансию');
                    } else {
                        await axios.post(import.meta.env.VITE_BASE_URL + `api/applications/add/`, applicationData);
                        message.info('Вы подали заявку');
                    }
                } catch (err) {
                    console.error("Ошибка при отправке заявки:", err);
                }
            } else {
                message.info('Вы не можете отправить заявку. Требуется роль "Студент"');
            }
        }
    });

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Header />
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
                <h1 style={{ marginBottom: "24px", fontSize: "2rem", fontWeight: "600" }}>
                    Доступные вакансии
                </h1>
                <Table<Vacancies> dataSource={resources} rowKey="id">
                    <Column 
                        title="Должность" 
                        dataIndex="post" 
                        key="post"
                        render={(text: string) => <strong>{text}</strong>}
                    />
                    <Column 
                        title="Описание" 
                        dataIndex="description" 
                        key="description"
                        ellipsis
                    />
                    <Column 
                        title="Начало" 
                        dataIndex="date_begin" 
                        key="date_begin"
                    />
                    <Column 
                        title="Окончание" 
                        dataIndex="date_end" 
                        key="date_end"
                    />
                    <Column 
                        title="Оклад" 
                        dataIndex="salary" 
                        key="salary"
                        render={(text: number) => <span style={{ fontWeight: "600", color: "var(--success-color)" }}>{text}000 ₽</span>}
                    />
                    <Column 
                        title="Уровень навыков"
                        key="level"
                        render={(record: Vacancies) => {
                            const skill = skills[record.level_skill];
                            return skill ? skill.level : 'Не указан';
                        }}
                    />
                    <Column
                        title="Действия"
                        key="action"
                        render={(record: Vacancies) => (
                            <Button 
                                type="primary"
                                onClick={() => postApplication(record)}
                            >
                                Откликнуться
                            </Button>
                        )}
                    />
                </Table>
            </div>
        </div>
    );
};
