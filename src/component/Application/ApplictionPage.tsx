import { useState, useEffect, FC } from 'react';
import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { Header } from '../Base/Header';
import { Application, Status, Vacancies } from '../../types';
import styles from './Application.module.css';

const ApplicationsPage: FC = () => {
    const [studentId, setStudentId] = useState<number | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [vacancies, setVacancies] = useState<{ [key: number]: Vacancies[] }>({});
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [error, setError] = useState<string>('');
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchStudentId = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/auth/me/?token=${token}`);
                setStudentId(response.data.student_id);
                if (response.data.role !== 1) {
                    message.error('Доступ запрещен');
                }
                else {
                    setStudentId(response.data.idbyrole);
                }
            } catch (error) {
                message.error('Ошибка при получении данных студента');
            }
        };

        fetchStudentId();
    }, [token]);

    useEffect(() => {
        if (studentId) {
            const fetchApplications = async () => {
                try {
                    const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/applications/?id_student=${studentId}`);
                    setApplications(response.data);
                } catch (error) {
                    message.error('Ошибка при получении заявок');
                }
            };

            fetchApplications();
        }
    }, [studentId]);

    useEffect(() => {
        const fetchStatusesData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/statuses/`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setStatuses(response.data);
            } catch (err) {
                setError("Не удалось загрузить данные статусов.");
                console.error("Ошибка при получении данных статусов:", err);
            }
        };
        fetchStatusesData();
    }, []);

    useEffect(() => {
        if (applications.length > 0) {
            const fetchVacancies = async () => {
                const vacancyPromises = applications.map(async (application: Application) => {
                    const vacancyId = application.id_vacancy;
                    try {
                        const response = await axios.get(import.meta.env.VITE_BASE_URL + `api/vacancies/?id=${vacancyId}`);
                        return { ...application, vacancy: response.data };
                    } catch (error) {
                        message.error(`Ошибка при получении вакансии для заявки с ID: ${application.id}`);
                        return application;
                    }
                });

                const vacanciesData = await Promise.all(vacancyPromises);
                const vacanciesMap: { [key: number]: Vacancies[] } = {};
                vacanciesData.forEach((item: Application & { vacancy?: Vacancies }) => {
                    if (item.id && item.vacancy) {
                        vacanciesMap[item.id] = [item.vacancy];
                    }
                });
                setVacancies(vacanciesMap);
            };

            fetchVacancies();
        }
    }, [applications]);

    if (error) {
        return <div>{error}</div>;
    }

    const statusStats = {
        pending: applications.filter((a: Application) => statuses.find((s: Status) => s.id === a.id_status)?.name === 'На рассмотрении').length,
        approved: applications.filter((a: Application) => statuses.find((s: Status) => s.id === a.id_status)?.name === 'Одобрено').length,
        rejected: applications.filter((a: Application) => statuses.find((s: Status) => s.id === a.id_status)?.name === 'Отклонено').length,
    };

    return (
        <div>
            <Header />
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
                <div className={styles.applicationsHeader}>
                    <h1 className={styles.applicationsTitle}>
                        Мои заявки
                        {applications.length > 0 && (
                            <span className={styles.applicationCount}>{applications.length}</span>
                        )}
                    </h1>
                </div>

                {applications.length > 0 && (
                    <div className={styles.applicationsStats}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Всего заявок</div>
                            <div className={styles.statValue}>{applications.length}</div>
                        </div>
                        <div className={styles.statCard} style={{ borderTopColor: "#faad14" }}>
                            <div className={styles.statLabel}>На рассмотрении</div>
                            <div style={{ color: "#faad14", fontSize: "1.75rem", fontWeight: "600" }}>
                                {statusStats.pending}
                            </div>
                        </div>
                        <div className={styles.statCard} style={{ borderTopColor: "#52c41a" }}>
                            <div className={styles.statLabel}>Одобрено</div>
                            <div style={{ color: "#52c41a", fontSize: "1.75rem", fontWeight: "600" }}>
                                {statusStats.approved}
                            </div>
                        </div>
                        <div className={styles.statCard} style={{ borderTopColor: "#f5222d" }}>
                            <div className={styles.statLabel}>Отклонено</div>
                            <div style={{ color: "#f5222d", fontSize: "1.75rem", fontWeight: "600" }}>
                                {statusStats.rejected}
                            </div>
                        </div>
                    </div>
                )}

                {applications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📋</div>
                        <h3 className={styles.emptyTitle}>Заявок не найдено</h3>
                        <p className={styles.emptyMessage}>
                            Вы ещё не подали ни одну заявку. Откройте доступные вакансии и подайте заявку!
                        </p>
                    </div>
                ) : (
                    <div>
                        {applications.map((application: Application) => {
                            const status = statuses.find((s: Status) => s.id === application.id_status);
                            const vacancy = vacancies[application.id] && vacancies[application.id][0];

                            let badgeClass = styles.badgePending;
                            if (status?.name === 'Одобрено') badgeClass = styles.badgeApproved;
                            else if (status?.name === 'Отклонено') badgeClass = styles.badgeRejected;

                            return (
                                <div key={application.id} className={styles.applicationCard}>
                                    <div className={styles.applicationHeader}>
                                        <h3 className={styles.applicationTitle}>
                                            {vacancy ? vacancy.post : `Вакансия #${application.id_vacancy}`}
                                        </h3>
                                        <span className={`${styles.applicationBadge} ${badgeClass}`}>
                                            {status ? status.name : 'Неизвестный статус'}
                                        </span>
                                    </div>

                                    {vacancy && (
                                        <div className={styles.applicationInfo}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Описание</span>
                                                <span className={styles.infoValue}>{vacancy.description}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Оклад</span>
                                                <span style={{ fontSize: "1rem", fontWeight: "600", color: "var(--success-color)" }}>
                                                    {vacancy.salary}000 ₽
                                                </span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Период</span>
                                                <span className={styles.infoValue}>
                                                    {vacancy.date_begin} - {vacancy.date_end}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationsPage;
