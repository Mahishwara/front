import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import axios, { type AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ProblemDetails, RegisterData } from "../../types";
import { Header } from "../Base/Header";
import styles from "./Auth.module.css";


export const RegisterForm: React.FC = () => {

	const navigate = useNavigate();
	const [form] = Form.useForm();

	const queryClient = useQueryClient();
	const { mutate: registerFC } = useMutation({
		mutationFn: async (resource: RegisterData) => {
			await axios({
				method: "POST",
				url: import.meta.env.VITE_BASE_URL + `api/auth/register/`,
				data: resource,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resource"] });
			navigate("/login");
		},
		onError(error, context) {
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
	


	return (
		<div>
			<Header />
			<div className={styles.authContainer}>
				<div className={styles.authCard}>
					<h1 className={styles.authTitle}>Регистрация</h1>
					<p className={styles.authSubtitle}>
						Создайте новый аккаунт
					</p>
					<Form
						form={form}
						layout="vertical"
						onFinish={async (data) => {
							registerFC(data);
							navigate("/login");
						}}
					>
						<Form.Item
							name="email"
							label="Электронная почта"
							rules={[{ required: true, message: "Обязательное поле" }]}
						>
							<Input
								type="email"
								className={styles.formInput}
								placeholder="example@email.com"
							/>
						</Form.Item>
						<Form.Item
							name="password"
							label="Пароль"
							rules={[{ required: true, message: "Обязательное поле" }]}
						>
							<Input.Password
								className={styles.formInput}
								placeholder="Введите пароль"
							/>
						</Form.Item>
						<Form.Item
							name="phone_number"
							label="Мобильный телефон"
							rules={[{ required: true, message: "Обязательное поле" }]}
						>
							<Input
								type="tel"
								className={styles.formInput}
								placeholder="+7 (XXX) XXX-XX-XX"
							/>
						</Form.Item>
						<Form.Item>
							<Button htmlType="submit" className={styles.submitButton} block>
								Зарегистрироваться
							</Button>
						</Form.Item>
						<div className={styles.toggle}>
							Уже есть аккаунт? <a href="/login">Войдите здесь</a>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};