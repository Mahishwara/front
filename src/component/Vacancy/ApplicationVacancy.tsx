import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Radio, Space, Table, message } from "antd";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Application, ProblemDetails, Status, Student, LevelSkill } from "../../types";
import { Header } from "../Base/Header";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../Application/Application.module.css";

const { Column } = Table;

export const VacancyApplications: React.FC<{
    resourceId?: number;
}> = React.memo(({ resourceId }) => {
    const [applicationsData, setApplicationData] = useState<Application[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [students, setStudents] = useState<{ [key: number]: Student | null }>({});
    const [skills, setSkills] = useState<{ [key: number]: LevelSkill | null }>({});
    const [error, setError] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchApplicationData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/applications?id_vacancy=${resourceId}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setApplicationData(response.data.data);

                const studentPromises = response.data.data.map(async (application: Application) => {
                    const studentResponse = await axios.get(import.meta.env.VITE_BASE_URL + `api/students/${application.id_student}`);
                    return { id: application.id_student, data: studentResponse.data.data };
                });

                const studentsData = await Promise.all(studentPromises);
                const studentsMap: { [key: number]: Student | null } = {};
                studentsData.forEach(student => {
                    studentsMap[student.id] = student.data;
                });
                setStudents(studentsMap);
            } catch (err) {
                setError('Не удалось загрузить данные заявок.');
                console.error("Ошибка при получении данных заявок:", err);
            }
        };
        fetchApplicationData();
    }, [resourceId]);

    useEffect(() => {
        const fetchStatusesData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/statuses/`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setStatuses(response.data.data);
            } catch (err) {
                setError("Не удалось загрузить данные статусов.");
                console.error("Ошибка при получении данных статусов:", err);
            }
        };
        fetchStatusesData();
    }, []);

    useEffect(() => {
        const fetchSkillsData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/skills`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const skillsMap: { [key: number]: LevelSkill} = {};
                response.data.data.forEach((skill: LevelSkill) => {
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

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: updateResource } = useMutation({
        mutationFn: async (resource: Application) => {
            await axios.put(import.meta.env.VITE_BASE_URL + `api/applications/update/${resource.id}`, resource);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resource"] });
            message.success('Статус заявки обновлен');
            navigate("/my-vacancies");
        },
        onError(error, context) {
            const c = context as { errorHandled?: boolean };
            if (c?.errorHandled) return;
            const axiosError = error as AxiosError;
            const problemDetails = axiosError.response?.data as ProblemDetails;
            if (problemDetails?.errors) {
                for (const p in problemDetails.errors)
                    form.setFields([
                        {
                            name: p,
                            errors: problemDetails.errors[p],
                        },
                    ]);
                return;
            }
            throw error;
        },
    });

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Header />
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
                <h1 style={{ marginBottom: "24px", fontSize: "2rem", fontWeight: "600" }}>
                    Заявки на вакансию
                </h1>

                {applicationsData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📨</div>
                        <h3 className={styles.emptyTitle}>Заявок нет</h3>
                        <p className={styles.emptyMessage}>
                            Никто ещё не подал заявку на эту вакансию
                        </p>
                    </div>
                ) : (
                    <Table<Application> dataSource={applicationsData}>
                        <Column 
                            title="Студент" 
                            key="students" 
                            render={(record: Application) => {
                                const student = students[record.id_student];
                                if (student) {
                                    const skill = skills[student.level_skill];
                                    return (
                                        <div>
                                            <strong>{student.fio}</strong>
                                            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                                                {student.post}
                                            </div>
                                            {skill && (
                                                <div style={{ fontSize: "0.85rem", color: "var(--primary-color)" }}>
                                                    Уровень: {skill.level}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return <p>Загрузка...</p>;
                            }} 
                        />
                        <Column 
                            title="Специальность" 
                            key="speciality"
                            render={(record: Application) => {
                                const student = students[record.id_student];
                                return student ? student.speciality : '-';
                            }}
                        />
                        <Column 
                            title="Курс" 
                            key="course"
                            render={(record: Application) => {
                                const student = students[record.id_student];
                                return student ? student.course : '-';
                            }}
                        />
                        <Column 
                            title="Статус" 
                            key="id_status" 
                            render={(record: Application) => {
                                const status = statuses.find(s => s.id === record.id_status);
                                let color = "default";
                                if (status?.name === 'Одобрено') color = "success";
                                else if (status?.name === 'Отклонено') color = "error";
                                return (
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        backgroundColor: color === 'success' ? "rgba(82, 196, 26, 0.1)" : 
                                                       color === 'error' ? "rgba(245, 34, 45, 0.1)" :
                                                       "rgba(250, 173, 20, 0.1)",
                                        color: color === 'success' ? "var(--success-color)" :
                                               color === 'error' ? "var(--error-color)" :
                                               "var(--warning-color)"
                                    }}>
                                        {status ? status.name : 'Неизвестный'}
                                    </span>
                                );
                            }}
                        />
                        <Column
                            title="Действие"
                            key="action"
                            render={(_: any, record: Application) => (
                                <Form
                                    form={form}
                                    layout="inline"
                                    onFinish={async (data) => {
                                        data.id = record.id;
                                        updateResource(data);
                                    }}
                                >
                                    <Form.Item
                                        name="id_status"
                                        label="Статус"
                                        rules={[{ required: true, message: "Выберите статус" }]}
                                    >
                                        <Radio.Group 
                                            options={statuses.map(status => ({ 
                                                label: status.name, 
                                                value: status.id.toString() 
                                            }))} 
                                            defaultValue={record.id_status.toString()}
                                            optionType="button"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" size="small">
                                            Обновить
                                        </Button>
                                    </Form.Item>
                                </Form>
                            )}
                        />
                    </Table>
                )}
            </div>
        </div>
    );
});
