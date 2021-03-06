import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../theme-context";

import Picker from "emoji-picker-react";
import { BsTrash } from "react-icons/bs";

import socketClient from "../../socket-client";
import "./TextBox.css";

const emojiPickerStyle = {
  width: "65%",
  position: "absolute",
  bottom: "12%",
  zIndex: "1",
  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.4)",
};

function TextBox({
  user,
  friend,
  controls,
  chatConfigObject,
  setControls,
  handleSentMessage,
  handleSelectedMessagesDeletion,
}) {
  const theme = useContext(ThemeContext);
  const messageInputRef = useRef(null);
  const selectedMessagesCounterRef = useRef(null);
  const [textBoxState, setTextBoxState] = useState({
    content: "",
    type: "text",
  });

  useEffect(() => {
    if (!chatConfigObject.toggleMessageSelector) {
      messageInputRef.current.focus();

      if (textBoxState.content) {
        const range = document.createRange();
        const selection = window.getSelection();

        messageInputRef.current.innerText = textBoxState.content;
        range.selectNodeContents(messageInputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else messageInputRef.current.innerText = "";
    } else if (selectedMessagesCounterRef.current.firstChild.nodeName === "#text")
      selectedMessagesCounterRef.current.removeChild(selectedMessagesCounterRef.current.firstChild);
  });

  useEffect(() => {
    if (!controls.toggleVoiceNoteButton) {
      setTextBoxState((prevState) => {
        return {
          ...prevState,
          content: "",
        };
      });
      messageInputRef.current.innerText = "";
    }
  }, [controls.toggleVoiceNoteButton]);

  function setTextBoxFocus() {
    messageInputRef.current.focus();
  }

  function handleTextMessage(e, emojiObject) {
    socketClient.emit("friend-actions", { user, friend, action: "Writing a message..." });

    switch (e.type) {
      case "click":
        setControls((prevState) => {
          return {
            ...prevState,
            textContent: `${prevState.textContent || ""}${emojiObject.emoji}`,
            toggleVoiceNoteButton: true,
          };
        });

        setTextBoxState((prevState) => {
          return {
            ...prevState,
            content: `${prevState.content || ""}${emojiObject.emoji}`,
          };
        });
        break;

      case "input":
        if (e.target.innerText.includes("\n") && chatConfigObject.shouldSetEnterToSend) {
          handleSentMessage(textBoxState);
          setTextBoxState((prevState) => {
            return {
              ...prevState,
              content: "",
            };
          });
        } else {
          setControls((prevState) => {
            return {
              ...prevState,
              textContent: e.target.innerText.trimStart(),
              toggleVoiceNoteButton: e.target.innerText.trimStart() ? true : false,
            };
          });

          setTextBoxState((prevState) => {
            return {
              ...prevState,
              content: e.target.innerText.trimStart(),
            };
          });
        }
        break;
      default:
    }
  }

  return (
    <>
      {chatConfigObject.toggleMessageSelector ? (
        <div
          className="selected-messages-container"
          style={{ backgroundColor: theme.secondaryColor, color: theme.fontColor }}
        >
          <div className="selected-messages" ref={selectedMessagesCounterRef}>
            <p>
              <span data-testid="selected-messages-counter">
                {chatConfigObject.selectedMessagesCounter}
              </span>{" "}
              messages selected
            </p>
            <button
              className="delete-messages-btn"
              aria-label="delete messages button"
              onClick={() => handleSelectedMessagesDeletion()}
            >
              <BsTrash />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="textbox-container"
          style={{ backgroundColor: theme.secondaryColor, color: theme.fontColor }}
        >
          {!textBoxState.content && !chatConfigObject.toggleMessageSelector && (
            <div className="textbox-placeholder" onClick={setTextBoxFocus}>
              <span>Write a message</span>
            </div>
          )}
          <div
            className="textbox-input"
            role="textbox"
            aria-label="message input"
            ref={messageInputRef}
            contentEditable
            onClick={setTextBoxFocus}
            onInput={handleTextMessage}
          ></div>
        </div>
      )}
      {controls.toggleEmojiPicker && (
        <Picker
          pickerStyle={emojiPickerStyle}
          disableAutoFocus={true}
          disableSearchBar={true}
          data-testid="emoji-picker"
          onEmojiClick={handleTextMessage}
        />
      )}
    </>
  );
}

export default TextBox;
