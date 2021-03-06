import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import Menu from "../Menu/Menu";

import socketClient from "../../socket-client";
import testSocket from "../../test_utils/testSocket";
import "./Friend.css";

function Friend({ friend, setChatConfigObject }) {
  const theme = useContext(ThemeContext);
  const [friendAction, setFriendAction] = useState("");

  useEffect(() => {
    document.title = friend.name;
    if (process.env.NODE_ENV === "test")
      testSocket.on("test:friend-actions", (action) => {
        setFriendAction(action);
      });
    else
      socketClient.on("friend-actions", ({ friendId, action }) => {
        if (friend.id === friendId) setFriendAction(action);
      });

    return () => {
      document.title = "";
      if (process.env.NODE_ENV === "test") testSocket.removeAllListeners("test:friend-actions");
      else socketClient.off("friend-actions");
    };
  }, [friend]);

  useEffect(() => {
    let timeout = null;

    if (friendAction)
      timeout = setTimeout(() => {
        setFriendAction(() => "");
      }, 2000);

    return () => clearInterval(timeout);
  });

  function handleChatSettings(settingOption) {
    switch (settingOption) {
      case "select-messages":
        setChatConfigObject((prevState) => {
          return {
            ...prevState,
            toggleMessageSelector: prevState.shouldToggleMessageSelector
              ? !prevState.toggleMessageSelector
              : false,
          };
        });
        break;

      case "empty-chat":
        setChatConfigObject((prevState) => {
          return {
            ...prevState,
            shouldEmptyChat: prevState.toggleMessageSelector ? false : true,
          };
        });
        break;

      case "enter-to-send":
        setChatConfigObject((prevState) => {
          return {
            ...prevState,
            shouldSetEnterToSend: !prevState.shouldSetEnterToSend,
          };
        });
        break;

      default:
        break;
    }
  }

  return (
    <div className="user-info" data-testid="friend">
      <div className="user-avatar" style={{ backgroundImage: `url(${friend.avatar})` }} />
      <div className="user-name">
        <span>{friend.name}</span>
        <span className="action-label" data-testid="action-label">
          {friendAction}
        </span>
      </div>
      <div className="menu-container">
        <Menu>
          <ul
            className="menu"
            aria-label="chat settings"
            style={{ backgroundColor: theme.background, border: `1px solid ${theme.fontColor}` }}
          >
            <li
              className="menu__item"
              aria-label="select messages"
              onMouseDown={() => handleChatSettings("select-messages")}
            >
              Select messages
            </li>
            <li
              className="menu__item"
              aria-label="empty chat"
              onMouseDown={() => handleChatSettings("empty-chat")}
            >
              Empty chat
            </li>
            <li
              className="menu__item"
              aria-label="enter to send"
              onMouseDown={() => handleChatSettings("enter-to-send")}
            >
              Enter to send
            </li>
          </ul>
        </Menu>
      </div>
    </div>
  );
}

export default Friend;
