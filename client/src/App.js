import { useState, useEffect, useReducer } from "react";
import { ThemeContext, themes } from "./theme-context";

import ChatPanel from "./Components/ChatPanel/ChatPanel";
import CreateUser from "./Components/CreateUser/CreateUser";
import ChatInfo from "./Components/ChatInfo/ChatInfo";
import Friend from "./Components/Friend/Friend";
import Profile from "./Components/Profile/Profile";

const initialState = {
  userIsCreated: false,
  user: {},
  friend: null,
  settingOptionToRender: "no-render-options",
  theme: themes.light,
};

function reducer(state, action) {
  switch (action.type) {
    case "CREATE_USER":
      return {
        ...state,
        userIsCreated: true,
        user: {
          name: action.userName,
          avatar: action.userAvatar,
        },
      };

    case "USER_CONNECTED":
      return {
        ...state,
        user: {
          ...action.user,
        },
      };

    case "GET_FRIEND":
      return {
        ...state,
        friend: action.user,
      };

    case "RENDER_PROFILE_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "profile-settings",
      };

    case "RENDER_BACKGROUND_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "background-settings",
      };

    case "RENDER_THEME_SETTINGS":
      return {
        ...state,
        settingOptionToRender: "theme-settings",
      };

    case "RENDER_CHAT_INFO":
      return {
        ...state,
        settingOptionToRender: "no-render-options",
      };

    case "NEW_PROFILE":
      return {
        ...state,
        settingOptionToRender: "no-render-options",
        user: {
          ...state.user,
          ...action.newProfile,
        },
      };

    case "CHANGE_THEME":
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [chatConfigObject, setChatConfigObject] = useState({
    toggleMessageSelector: false,
    shouldToggleMessageSelector: false,
    shouldEmptyChat: false,
    shouldDeleteSelectedMessages: false,
    shouldSetEnterToSend: false,
    selectedMessagesCounter: 0,
    backgroundColor: state.theme.primaryColor,
    toggleBackgroundColor: "",
  });

  useEffect(() => {
    setChatConfigObject((prevState) => {
      return {
        ...prevState,
        backgroundColor: state.theme.primaryColor,
      };
    });
  }, [state.theme.primaryColor]);

  return state.userIsCreated ? (
    <ThemeContext.Provider value={state.theme}>
      <ChatPanel
        user={state.user}
        friend={state.friend}
        settingOption={state.settingOptionToRender}
        dispatch={dispatch}
        chatConfigObject={chatConfigObject}
        setChatConfigObject={setChatConfigObject}
        friendComponent={<Friend friend={state.friend} setChatConfigObject={setChatConfigObject} />}
        chatInfo={<ChatInfo user={state.user} currentFriend={state.friend} dispatch={dispatch} />}
        profile={<Profile user={state.user} dispatch={dispatch} />}
      />
    </ThemeContext.Provider>
  ) : (
    <CreateUser dispatch={dispatch} />
  );
}

export default App;
