import React, { useState } from "react";
import "./Login.css";

const Login = ({ history }) => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("0");

  const loginToChatGroupHandler = (e) => {
    e.preventDefault();
    if (userName.length < 3 || room === "0") {
      return alert("لطفا نام کاربری و گروه گپ را انتخاب کنید!");
    }
    history.push(`/massenger?userName=${userName}&room=${room}`);
  };

  return (
    <section id="login">
      <div className="login_form_wrapper">
        <h3>پیام رسان گُنشاپ</h3>
        <form className="login_form" onSubmit={loginToChatGroupHandler}>
          <input
            type="text"
            placeholder="نام کاربری :"
            className="mb-2"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <select
            className="my-2"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="0" disabled>
              گروه گپ را انتخاب کنید
            </option>
            <option>پرسپولیسی ها</option>
            <option>استقلالی ها</option>
            <option>فیلم بازان</option>
            <option>موسیقی فن ها</option>
            <option>عکاسان</option>
          </select>
          <button type="submit">ورود</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
