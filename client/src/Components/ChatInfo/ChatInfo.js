import { useState, useEffect } from "react";
import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";

import User from "../User/User";

import noUsers from "../../chat-icons/no-active-users.png";
import "./ChatInfo.css";

function ActiveUsersList({ activeUsers, setFriend }) {
	return (
		<div className="active-users-container">
			{activeUsers.map((user, index) => {
				return (
					<div
						className="user-info"
						data-testid="active-user"
						key={index}
						onClick={() => {
							if (process.env.NODE_ENV !== "test") setFriend(user);
						}}
					>
						<img src={user.avatar} alt={user.name} className="user-avatar" />
						<div className="user-name">
							<span>{user.name}</span>
						</div>
						<div className="new-messages-counter">
							<span data-testid="new-messages-counter">7</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function ChatInfo({ user, setFriend }) {
	const [activeUsers, setActiveUsers] = useState([]);

	useEffect(() => {
		if (process.env.NODE_ENV === "test") {
			testSocket.on("test:active-users", (users) => {
				setActiveUsers(users);
			});
		} else
			socketClient.on("active-users", (users) => {
				setActiveUsers(users.filter((user) => user.id !== socketClient.id));
			});

		return () => {
			if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:active-users");
		};
	}, []);

	return (
		<div className="chat-info" data-testid="chat-info">
			<div className="user-container">
				<User user={user} />
			</div>
			{activeUsers.length === 0 ? (
				<div className="no-active-users">
					<div className="no-active-users-container">
						<span>No active users</span>
						<img src={noUsers} alt="No users" loading="lazy" />
					</div>
				</div>
			) : (
				<ActiveUsersList activeUsers={activeUsers} setFriend={setFriend} />
			)}
		</div>
	);
}

export default ChatInfo;