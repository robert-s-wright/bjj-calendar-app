import React from "react";
import { useState, useEffect } from "react";

import styles from "./Login.module.css";

import { loginUser, authorizeUser } from "../requests/requests";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function Login(props) {
  const { setLoading, setAddingClub, setRegistering, verifyUser } = props;

  const emptyUser = {
    email: "",
    password: "",
    clubId: [],
  };

  const [user, setUser] = useState(emptyUser);

  const [loginSuccess, setLoginSuccess] = useState(undefined);

  const handleLogin = async () => {
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
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Card className={`p-3 m-3`}>
          <h3>BJJ Calendar Login</h3>
        </Card>
        <Card className={`p-3 ${styles.loginCard}`}>
          <Form>
            {
              {
                false: (
                  <Alert variant="warning">
                    You have entered an invalid password, check your credentials
                    and try again.
                  </Alert>
                ),
                "no access": (
                  <Alert variant="warning">
                    You lack rights to access the application. Contact the
                    administrator to receive access rights.
                  </Alert>
                ),
                null: (
                  <Alert variant="warning">
                    You have entered an invalid username, check your credentials
                    and try again.
                  </Alert>
                ),
              }[loginSuccess]
            }

            <FloatingLabel
              label="E-mail"
              className="mb-3"
            >
              <Form.Control
                type="email"
                name="email"
                placeholder="E-Mail"
                required
                value={user.email}
                onChange={(e) => {
                  setUser((state) => ({ ...state, email: e.target.value }));
                }}
              ></Form.Control>
            </FloatingLabel>

            <FloatingLabel
              label="Password"
              className="mb-3"
            >
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
                value={user.password}
                onChange={(e) => {
                  setUser((state) => ({
                    ...state,
                    password: e.target.value,
                  }));
                }}
              ></Form.Control>
            </FloatingLabel>

            <Button
              className="m-2"
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </Button>
            <div>Need to sign up?</div>
            <Button
              className="m-2"
              onClick={() => {
                setRegistering(true);
                setUser(emptyUser);
                setLoginSuccess(undefined);
              }}
            >
              Register Here
            </Button>
          </Form>
        </Card>
      </div>
      <Card className="p-3 m-3">
        <div className="mb-2">
          Would you like to begin using this calendar in your club?
        </div>
        <Button onClick={() => setAddingClub(true)}>Click Here</Button>
      </Card>
    </>
  );
}

export default Login;
