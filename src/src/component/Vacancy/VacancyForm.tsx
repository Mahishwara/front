import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input} from "antd";
import axios, { type AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemDetails, User, Vacancies } from "../../types";
import { Header } from "../Base/Header";
import Cookies from "js-cookie";
import styles from "./Vacancy.module.css";


export const VacancyForm: React.FC<{
	resourceId?: number;
}> = React.memo(({ resourceId }) => {
	const [userData, setUserData] = useState<User>();
	const [error, setError] = useState(String);
	const isNew = !resourceId;
	const token = Cookies.get('token');

	const navigate = useNavigate();
	const [form] = Form.useForm();

	const { data: resource } = useQuery({
		queryKey: ["resource", resourceId],
		enabled: !isNew,
		queryFn: async () => {
			const res = await axios.get<Vacancies>(import.meta.env.VITE_BASE_URL + `api/vacancies/${resourceId}`);
			return res.data;
		},
	});


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
					setError('Не удалось загрузить данные профиля.');
					console.error("Ошибка при получении данных пользователя:", err);
				}
			};
			fetchUserData();
		}, [token]);

	const queryClient = useQueryClient();
	const { mutate: saveResource } = useMutation({
		mutationFn: async (resource: Vacancies) => {
			await axios({
				method: isNew ? "POST" : "PUT",
				url: import.meta.env.VITE_BASE_URL + `api/vacancies/${isNew ? "add/" : "update/" + resourceId}`,
				data: resource,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resource"] });
			navigate("..");
		},
		onError(error,context) {
			const c = context as { errorHandled?: boolean };
			if (c?.errorHandled) return;
			const axiosError = error as AxiosError;
			const problemDetails = axiosError.response?.data as ProblemDetails;
			if (problemDetails?.errors) {
				for (const p in problemDetails?.errors)
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

	useEffect(() => {
		if (resource) {
			form.setFieldsValue(resource);
		}
	}, [resource, form]);
	if (error) {
        return <div>{error}</div>;
    }

	return (
		<>
			<Header />
			<div className={styles.vacancyForm} style={{ maxWidth: "800px", margin: "24px auto" }}>
				<div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
					<h1 style={{ margin: "0 0 8px 0", fontSize: "2rem", fontWeight: "600" }}>
						{isNew ? "Создать новую вакансию" : "Редактировать вакансию"}
					</h1>
					<p style={{ margin: "0", color: "var(--text-secondary)" }}>
						{isNew ? "Заполните информацию о вакансии" : "Обновите информацию о вакансии"}
					</p>
				</div>

				<Form
					form={form}
					layout="vertical"
					onFinish={async (data) => {
						if (userData){
						data.id_employer = userData.employer_id;
						}
						saveResource(data);
					}}
				>
					<div className={styles.formSection}>
						<h2 className={styles.formSectionTitle}>Основная информация</h2>
						
						<Form.Item
							name="post"
							label="Должность"
							rules={[{ required: true, message: "Обязательное поле" }]}
						>
							<Input className={styles.formInput} placeholder="Frontend разработчик" />
						</Form.Item>

						<Form.Item
							name="description"
							label="Описание вакансии"
							rules={[{ required: true, message: "Обязательное поле" }]}
						>
							<Input.TextArea className={styles.formTextarea} placeholder="Описание должности и требования..." rows={4} />
						</Form.Item>
					</div>

					<div className={styles.formSection}>
						<h2 className={styles.formSectionTitle}>Период стажировки</h2>
						
						<div className={styles.formRow}>
							<div className={styles.formGroup}>
								<label className={styles.formLabel}>Дата начала (ГГГГ-ММ-ДД)</label>
								<Form.Item
									name="date_begin"
									rules={[{ required: true, message: "Обязательное поле" }]}
								>
									<Input className={styles.formInput} type="date" />
								</Form.Item>
							</div>

							<div className={styles.formGroup}>
								<label className={styles.formLabel}>Дата окончания (ГГГГ-ММ-ДД)</label>
								<Form.Item
									name="date_end"
									rules={[{ required: true, message: "Обязательное поле" }]}
								>
									<Input className={styles.formInput} type="date" />
								</Form.Item>
							</div>
						</div>
					</div>

					<div className={styles.formSection}>
						<h2 className={styles.formSectionTitle}>Оплата и требования</h2>
						
						<div className={styles.formRow}>
							<div className={styles.formGroup}>
								<label className={styles.formLabel}>Оклад (в тысячах рублей)</label>
								<Form.Item
									name="salary"
									rules={[{ required: true, message: "Обязательное поле" }]}
								>
									<Input className={styles.formInput} type="number" placeholder="100" />
								</Form.Item>
							</div>

							<div className={styles.formGroup}>
								<label className={styles.formLabel}>Требуемый уровень навыков</label>
								<Form.Item
									name="level_skill"
									rules={[{ required: true, message: "Обязательное поле" }]}
								>
									<Input className={styles.formInput} type="number" placeholder="1 (Junior) - 3 (Senior)" />
								</Form.Item>
							</div>
						</div>
					</div>

					<Form.Item style={{ marginTop: "32px", marginBottom: "0" }}>
						<div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
							<Button onClick={() => navigate("..")}>Отмена</Button>
							<Button type="primary" htmlType="submit">
								{isNew ? "Создать вакансию" : "Сохранить изменения"}
							</Button>
						</div>
					</Form.Item>
				</Form>
			</div>
		</>
	);
});