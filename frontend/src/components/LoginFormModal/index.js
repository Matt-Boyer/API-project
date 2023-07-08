import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  let disable = true
  if (credential.length > 3 && password.length > 5) {
    disable = false
  }

  return (
    <>
      <h1 id="login">Log In</h1>
      <form id='form' onSubmit={handleSubmit}>

          <input
          placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />


          <input
          placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        {errors.credential && (
          <p className="errorsforlogin">{errors.credential}</p>
        )}
        <button type="submit" disabled={disable}>Log In</button>
        <button
        onClick={(e) => {
          setErrors({});
          return dispatch(sessionActions.login({ credential:'Demo-lition', password:'password' }))
            .then(closeModal)
            .catch(async (res) => {
              const data = await res.json();
              if (data && data.errors) {
                setErrors(data.errors);
              }
            });
        }}
        >Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
