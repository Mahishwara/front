import {Flex} from "antd";
import axios from "axios";
import React from "react";
import { Outlet } from "react-router-dom";
import { HeaderExtensions } from "./HeaderExtensions";
import styles from "./Layout.module.css";

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (401 === error.response.status) {
			location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export const Layout: React.FC = React.memo(() => {

	return (
		<div className={styles.layoutContainer}>
			<div className={styles.layoutHeader}>
				<Flex
					align="baseline"
					justify="space-between"
					style={{ 
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", 
						padding: "4px 16px",
						background: "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)"
					}}
				>
					<HeaderExtensions />
				</Flex>
			</div>
			<div className={styles.layoutMain}>
				<div className={styles.layoutContentArea}>
					<Outlet />
				</div>
			</div>
		</div>
	);
});
