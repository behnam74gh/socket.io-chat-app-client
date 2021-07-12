import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import ReactEmoji from "react-emoji";
import "./Massenger.css";

let socket;

const Massenger = ({ location, history }) => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const ENDPOINT = process.env.SOCKETIOENDPOINT || "localhost:5000";

  useEffect(() => {
    const { userName: name, room: group } = queryString.parse(location.search);
    setUserName(name);
    setRoom(group);

    socket = io(ENDPOINT);

    socket.emit("join", { name, room: group }, ({ errorMessage }) => {
      if (errorMessage && errorMessage.length > 0) {
        return alert(errorMessage);
      }
      return;
    });

    return () => {
      socket.emit("leave");

      socket.off();
    };
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", (data) => {
      const { room: group, users: groupsUsers } = data;
      if (group === room && groupsUsers.length > 0) {
        setUsers(groupsUsers);
      }
    });
  }, [messages, room]);

  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (message.length > 0) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <section id="massenger">
      <div className="massenger_header">
        <strong>گُنشاپ</strong>
        <button className="leave_group_btn" onClick={() => history.push("/")}>
          خروج از گپ
        </button>
      </div>
      <aside className="massenger_sidebar">
        {room.length > 0 && (
          <span className="chat_group_name">
            نام گپ :<strong className="mx-1">{room}</strong>
          </span>
        )}
        <h5>اعضای گپ {room.length > 0 && room}</h5>
        <ul className="users">
          <li>{userName.length > 0 && userName}</li>
          {users.length > 0 &&
            users
              .filter((user) => user.id !== socket.id)
              .map((userItem, i) => <li key={i}>{userItem.name}</li>)}
        </ul>
      </aside>
      <main className="massenger_body">
        {messages.length > 0 &&
          messages.map((singleMessage, i) => (
            <div
              key={i}
              className="message_wrapper"
              style={{
                background: singleMessage.user === userName && "#d1e1f9",
                alignSelf:
                  singleMessage.user === userName ||
                  singleMessage.user === "مدیر گپ :"
                    ? "flex-start"
                    : "flex-end",
              }}
            >
              <div className="author_info">
                <strong>{singleMessage.user}</strong>
                <span className="message_time">
                  {new Date(singleMessage.time).toLocaleString("fa", {
                    minute: "numeric",
                    hour: "numeric",
                  })}
                </span>
              </div>
              <p className="message_content">
                {ReactEmoji.emojify(singleMessage.message)}
              </p>
            </div>
          ))}
        <form className="message_form_wrapper" onSubmit={sendMessageHandler}>
          <div className="message_input_wrapper">
            <input
              type="text"
              placeholder="پیام..."
              className="message_input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" ? sendMessageHandler : null
              }
            />
          </div>

          <div className="send_message_btn_wrapper">
            <input className="send_message_btn" type="submit" value="ارسال" />
          </div>
        </form>
      </main>
    </section>
  );
};

export default Massenger;
