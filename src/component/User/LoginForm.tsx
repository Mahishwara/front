import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import axios, { type AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { Header } from "../Base/Header";
import { LoginData, ProblemDetails } from "../../types";
import styles from "./Auth.module.css";

export const LoginForm: React.FC = () => {

	const navigate = useNavigate();
	const [form] = Form.useForm();

	const queryClient = useQueryClient();
	const { mutate: loginFC } = useMutation({
		mutationFn: async (resource: LoginData) => {
			const responce = await axios({
				method: "POST",
				url: import.meta.env.VITE_BASE_URL + `api/auth/login/`,
				data: resource,
			});
            if (responce.status === 200) {
                const token = responce.data.access_token;
                Cookies.set('token', token, {
                    path: '/',
                    secure: true
                });
            }
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resource"] });
            navigate("/profile")
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
		<>
            <Header />
			<div className={styles.authContainer}>
				<div className={styles.authCard}>
					<h1 className={styles.authTitle}>Вход в аккаунт</h1>
					<p className={styles.authSubtitle}>
						Введите ваши учетные данные для входа
					</p>
					<Form
						form={form}
						layout="vertical"
						onFinish={async (data) => {
							loginFC(data);
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
						
						<Form.Item>
							<Button htmlType="submit" className={styles.submitButton} block>
								Войти
							</Button>
						</Form.Item>
						<div className={styles.toggle}>
							Нет аккаунта? <a href="/register">Зарегистрируйтесь здесь</a>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};
