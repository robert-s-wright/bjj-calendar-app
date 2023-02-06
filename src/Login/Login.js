import React from "react";
import { useState, forwardRef } from "react";

import styles from "./Login.module.css";

import { loginUser } from "../requests/requests";

import { TextField, Button, Card, Alert, Fade } from "@mui/material";

const Login = React.forwardRef((props, nodeRef) => {
  const {
    setLoading,
    setAddingClub,
    setRegistering,
    setLoggingIn,
    verifyUser,
    transitionStyle,
  } = props;

  const emptyUser = {
    email: "",
    password: "",
    clubId: [],
  };

  const [user, setUser] = useState(emptyUser);

  const [loginSuccess, setLoginSuccess] = useState(undefined);

  const [formErrors, setFormErrors] = useState({
    email: true,
    password: true,
  });

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(user);

    if (result.data.success === false) {
      setLoginSuccess(false);
    } else if (result.data.success === null) {
      setLoginSuccess(null);
    } else if (result.data.readAccess === false) {
      setLoginSuccess("no access");
    } else if (result.data.success && result.data.readAccess) {
      setLoading(true);
      await verifyUser();
      setLoginSuccess(true);
      setLoading(false);
      setLoggingIn(false);
    }
  };

  return (
    <form
      className={styles.wrapper}
      style={{ ...transitionStyle }}
    >
      <Card className={styles.header}>
        <h3>BJJ Calendar Login</h3>
      </Card>
      <Card className={styles.loginCard}>
        {
          {
            false: (
              <Alert severity="warning">
                You have entered an invalid password, check your credentials and
                try again.
              </Alert>
            ),
            "no access": (
              <Alert severity="warning">
                You lack rights to access the application. Contact the
                administrator to receive access rights.
              </Alert>
            ),
            null: (
              <Alert severity="warning">
                You have entered an invalid username, check your credentials and
                try again.
              </Alert>
            ),
          }[loginSuccess]
        }
        <div className={styles.container}>
          <TextField
            className={styles.input}
            name="username"
            type="username"
            id="username"
            label="E-mail"
            required
            error={attemptedSubmit && formErrors.password}
            helperText={
              attemptedSubmit && formErrors.password
                ? "Please enter your login e-mail"
                : null
            }
            value={user.email ? user.email : ""}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                email: e.target.value,
              }));
              setFormErrors((state) => ({
                ...state,
                email: e.target.value.match(
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                )
                  ? false
                  : true,
              }));
            }}
          />
          <TextField
            className={styles.input}
            name="password"
            type="password"
            id="password"
            label="Password"
            required
            error={attemptedSubmit && formErrors.password}
            helperText={
              attemptedSubmit && formErrors.password
                ? "Please enter your password"
                : null
            }
            value={user.password ? user.password : ""}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                password: e.target.value,
              }));
              setFormErrors((state) => ({
                ...state,
                password: e.target.value.match(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\S)[A-Za-z\S]{8,30}$/
                )
                  ? false
                  : true,
              }));
            }}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={(e) => {
              handleLogin(e);
            }}
          >
            Login
          </Button>
          <div>Need to sign up?</div>
          <Button
            variant="contained"
            onClick={() => {
              setRegistering(true);
              setLoggingIn(false);
              setUser(emptyUser);
              setLoginSuccess(undefined);
            }}
          >
            Register Here
          </Button>
        </div>
      </Card>
      <Card className={styles.addClubContainer}>
        <div>Would you like to begin using this calendar in your club?</div>
        <Button
          variant="contained"
          onClick={() => {
            setAddingClub(true);
            setLoggingIn(false);
          }}
        >
          Click Here
        </Button>
      </Card>
    </form>
  );
});

export default Login;
