import { useState, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import Avatars from "../Avatars/Avatars";
import NameSettings from "../NameSettings/NameSettings";
import { BsPencil } from "react-icons/bs";
import { AiOutlineCamera } from "react-icons/ai";

import socketClient from "../../socket-client";
import "./Profile.css";

function Profile({ user, dispatch }) {
  const theme = useContext(ThemeContext);
  const [profileState, setProfileState] = useState({
    toggleAvatarButton: false,
    settingsToRender: "",
  });
  const [newProfile, setNewProfile] = useState({
    name: "",
    avatar: "",
  });

  function handleMouseHover(e) {
    if (e.type === "mouseleave")
      setProfileState((prevState) => {
        return {
          ...prevState,
          toggleAvatarButton: false,
        };
      });
    if (e.type === "mouseenter")
      setProfileState((prevState) => {
        return {
          ...prevState,
          toggleAvatarButton: true,
        };
      });
  }

  function handleSelectOptions(e) {
    const trigger = e.target.getAttribute("data-trigger-value");

    if (trigger === "change-avatar")
      setProfileState((prevState) => {
        return {
          prevState,
          settingsToRender: "avatar-settings",
        };
      });
    else if (trigger === "edit-name")
      setProfileState((prevState) => {
        return {
          ...prevState,
          settingsToRender: "name-settings",
        };
      });
    //Next conditional was made due to handler doesn't propagate in all svg icon elements.
    else if (
      e.target.parentElement.parentElement.getAttribute("data-trigger-value") === "change-avatar"
    )
      setProfileState((prevState) => {
        return {
          ...prevState,
          settingsToRender: "avatar-settings",
        };
      });
    else
      setProfileState((prevState) => {
        return {
          ...prevState,
          settingsToRender: "name-settings",
        };
      });
  }

  function handleChangeProfile() {
    if (newProfile.name || newProfile.avatar) {
      dispatch({ type: "NEW_PROFILE", newProfile });
      socketClient.emit("change-profile", { ...user, ...newProfile });
    } else dispatch({ type: "RENDER_CHAT_INFO" });
  }

  return (
    <>
      <div className="profile-container" data-testid="profile">
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${newProfile.avatar ? newProfile.avatar : user.avatar})`,
          }}
          data-testid="profile-image"
          onMouseEnter={(e) => handleMouseHover(e)}
          onMouseLeave={(e) => handleMouseHover(e)}
        >
          {profileState.toggleAvatarButton && (
            <button
              className="change-avatar-btn"
              aria-label="select avatar button"
              data-trigger-value="change-avatar"
              onClick={(e) => handleSelectOptions(e)}
              style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
            >
              <AiOutlineCamera data-trigger-value="change-avatar" />
            </button>
          )}
        </div>
        <div className="profile-name">
          <span>{newProfile.name ? newProfile.name : user.name}</span>
          <button
            className="edit-name-btn"
            aria-label="edit name button"
            onClick={(e) => handleSelectOptions(e)}
            data-trigger-value="edit-name"
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            <BsPencil data-trigger-value="edit-name" />
          </button>
        </div>
        <div className="change-profile">
          <button
            className="change-profile-btn"
            aria-label="change profile button"
            onClick={() => {
              handleChangeProfile();
            }}
            style={{ backgroundColor: theme.primaryColor, color: theme.fontColor }}
          >
            {newProfile.name || newProfile.avatar ? "Change" : "Back"}
          </button>
        </div>
      </div>
      <div className="settings-container">
        {profileState.settingsToRender === "avatar-settings" ? (
          <Avatars user={user} newProfile={newProfile} setNewProfile={setNewProfile} />
        ) : (
          profileState.settingsToRender === "name-settings" && (
            <NameSettings user={user} newProfile={newProfile} setNewProfile={setNewProfile} />
          )
        )}
      </div>
    </>
  );
}

export default Profile;
