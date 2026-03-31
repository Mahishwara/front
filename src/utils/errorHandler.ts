import { message } from "antd";
import type { AxiosError } from "axios";
import type { ProblemDetails, APIErrorResponse } from "../types";

const formatObject = (obj: unknown): string => {
	if (!obj) return "Нет дополнительных данных";
	try {
		return JSON.stringify(obj, null, 2);
	} catch {
		return String(obj);
	}
};

const isProblemDetails = (obj: unknown): obj is ProblemDetails => {
	if (!obj || typeof obj !== "object") return false;
	const suspected = obj as Partial<ProblemDetails>;
	return typeof suspected.title === "string" && typeof suspected.status === "number";
};

const isAPIErrorResponse = (obj: unknown): obj is APIErrorResponse => {
	if (!obj || typeof obj !== "object") return false;
	const suspected = obj as Partial<APIErrorResponse>;
	return typeof suspected.user_message === "string" && typeof suspected.error_type === "string";
};

export const handleApiError = (error: unknown, context?: string) => {
	let title = "Ошибка API";
	let alertText = "Неизвестная ошибка. Попробуйте ещё раз.";

	if (error && typeof error === "object" && "message" in error) {
		const err = error as { message?: unknown };
		if (typeof err.message === "string") {
			// стандартный JS Error
			title = "Ошибка";
			alertText = err.message;
		}
	}

	if ((error as AxiosError)?.isAxiosError) {
		const axiosErr = error as AxiosError;
		const response = axiosErr.response;
		if (response) {
			const data = response.data;
			if (isAPIErrorResponse(data)) {
				title = `${data.error_type.toUpperCase()} ${response.status}`;
				alertText = `Ошибка: ${data.user_message}\n\nПричина: ${data.reason}\nРешение: ${data.solution}`;
				if (data.developer_message) alertText += `\n\nДля разработчика: ${data.developer_message}`;
				if (data.details) alertText += `\n\nДетали: ${formatObject(data.details)}`;
				message.error({ content: data.user_message });
				window.alert(alertText);
				return;
			}
			if (isProblemDetails(data)) {
				title = `${data.title} (${data.status})`;
				alertText = `${data.detail} ${data.errors ? formatObject(data.errors) : ""}`;
				message.error({ content: data.title });
				window.alert(`${title}\n${alertText}`);
				return;
			}
			// если ответ другой структуры
			message.error({ content: response.statusText || "Ошибка запроса" });
			window.alert(`HTTP ${response.status} - ${(response.statusText || "Ошибка запроса")}`);
			return;
		}
	}

	if (isAPIErrorResponse(error)) {
		const api = error;
		message.error({ content: api.user_message });
		window.alert(`Ошибка: ${api.user_message}\nПричина: ${api.reason}\nРешение: ${api.solution}`);
		return;
	}

	if (isProblemDetails(error)) {
		const problem = error;
		message.error({ content: problem.title });
		window.alert(`Ошибка: ${problem.title}\n${problem.detail}`);
		return;
	}

	if (typeof error === "string") {
		message.error({ content: error });
		window.alert(error);
		return;
	}

	message.error({ content: "Произошла непредвиденная ошибка" });
	window.alert(`Произошла непредвиденная ошибка. ${context ?? ""}`);
};