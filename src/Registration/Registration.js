import React from "react";

import { useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";

import { Typeahead } from "react-bootstrap-typeahead";

import Select from "react-select";

import { registerUser, getClubs } from "../requests/requests";

import { kidBelts, adultBelts, age } from "./../utils";

import styles from "./Registration.module.css";

function Registration(props) {
  const { setRegistering, clubList } = props;

  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    clubId: [],
    belt: "",
    receivedDate: "",
    needWriteAccess: [],
    defaultClub: "",
  };

  const [user, setUser] = useState(emptyUser);

  // const [clubList, setClubList] = useState([]);

  const [registerSuccess, setRegisterSuccess] = useState(undefined);

  const [validated, setValidated] = useState(false);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [formErrors, setFormErrors] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    birthday: true,
    clubId: true,
    belt: true,
    receivedDate: true,
    needWriteAccess: true,
    defaultClub: true,
  });

  // const kidBelts = [
  //   "White",
  //   "Gray & White",
  //   "Gray",
  //   "Gray & Black",
  //   "Yellow & White",
  //   "Yellow",
  //   "Yellow & Black",
  //   "Orange & White",
  //   "Orange",
  //   "Orange & Black",
  //   "Green & White",
  //   "Green",
  //   "Green & Black",
  // ];

  // const adultBelts = [
  //   "White",
  //   "Blue",
  //   "Purple",
  //   "Brown",
  //   "Black",
  //   "Red & Black",
  //   "Red & White",
  //   "Red",
  // ];

  useEffect(() => {
    // console.log(user);
    // console.log(
    //   clubList.filter((item) => user.needWriteAccess.includes(item.value))
    // );
  }, [user]);

  // const age =
  //   user.birthday !== ""
  //     ? Math.floor((new Date() - new Date(user.birthday)) / 31557600000)
  // : null;

  const handleRegister = async (e) => {
    setAttemptedSubmit(true);
    e.preventDefault();

    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      const result = await registerUser(user);
      if (result.data) {
        setRegisterSuccess(true);
      } else {
        setRegisterSuccess(false);
      }
    }
  };

  return (
    <Card className={`p-3 ${styles.card}`}>
      <Card className={`p-3 m-3`}>
        <h3>User Sign Up</h3>
      </Card>
      {
        {
          true: (
            <Alert variant="success">
              Username registered successfully, upon review, the administrator
              will grant you access rights.
            </Alert>
          ),
          false: (
            <Alert variant="warning">
              This e-mail is already associated with an account, please proceed
              to the login page.
            </Alert>
          ),
          undefined: null,
        }[registerSuccess]
      }
      <Form
        noValidate
        validated={validated}
        onSubmit={handleRegister}
      >
        <FloatingLabel
          label="First Name"
          className="mb-3"
        >
          <Form.Control
            required
            isValid={!formErrors.firstName}
            isInvalid={attemptedSubmit && formErrors.firstName}
            type="text"
            name="firstName"
            placeholder="First Name"
            value={user.firstName}
            onChange={(e) => {
              setUser((state) => ({ ...state, firstName: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                firstName: e.target.value.length > 0 ? false : true,
              }));
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter your first name
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Last Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="lastName"
            placeholder="Last Name"
            isValid={!formErrors.lastName}
            isInvalid={attemptedSubmit && formErrors.lastName}
            required
            value={user.lastName}
            onChange={(e) => {
              setUser((state) => ({ ...state, lastName: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                lastName: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your last name
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="E-mail"
          className="mb-3"
        >
          <Form.Control
            type="email"
            name="email"
            placeholder="E-Mail"
            isValid={!formErrors.email}
            isInvalid={attemptedSubmit && formErrors.email}
            required
            value={user.email}
            onChange={(e) => {
              setUser((state) => ({ ...state, email: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                email: e.target.value.match(
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                )
                  ? false
                  : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a valid E-Mail
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            isValid={!formErrors.password}
            isInvalid={attemptedSubmit && formErrors.password}
            required
            value={user.password}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                password: e.target.value,
              }));
              setFormErrors((state) => ({
                ...state,
                password: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a valid password
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Your birthday"
          className="mb-3"
        >
          <Form.Control
            type="date"
            name="date"
            isValid={!formErrors.birthday}
            isInvalid={attemptedSubmit && formErrors.birthday}
            placeholder="Date"
            required
            value={user.birthday}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                birthday: e.target.value,
              }));
              setFormErrors((state) => ({
                ...state,
                birthday: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your birthday
          </Form.Control.Feedback>
        </FloatingLabel>
        <Form.Group>
          <Typeahead
            {...user.clubId}
            multiple
            id="clubSelection"
            placeholder="Select clubs you are affiliated with"
            className={`mb-3 ${styles.select}`}
            required
            isValid={!formErrors.clubId}
            isInvalid={attemptedSubmit && formErrors.clubId}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                clubId: e.map((item) => item.value),
                needWriteAccess: state.needWriteAccess.filter((club) => {
                  const clubIds = e.map((club) => club.value);
                  return clubIds.includes(club);
                }),
              }));

              setFormErrors((state) => ({
                ...state,
                clubId: e.length > 0 ? false : true,
              }));
            }}
            options={clubList}
          />
          <Form.Control.Feedback type="invalid">
            Please select clubs you are affiliated with
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Typeahead
            {...user.defaultClub}
            id="defaultClubSelection"
            placeholder="Select your primary club"
            className={`mb-3 ${styles.select}`}
            required
            isValid={!formErrors.defaultClub}
            isInvalid={attemptedSubmit && formErrors.defaultClub}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                defaultClub: e.length === 0 ? "" : e[0].value,
              }));

              setFormErrors((state) => ({
                ...state,
                defaultClub: e.length > 0 ? false : true,
              }));
            }}
            options={clubList.filter((item) =>
              user.clubId.includes(item.value)
            )}
          />
          <Form.Control.Feedback type="invalid">
            Please select clubs you are affiliated with
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Typeahead
            id="beltSelection"
            placeholder="Select your belt"
            className={`mb-3 ${styles.select}`}
            isValid={!formErrors.belt}
            isInvalid={attemptedSubmit && formErrors.belt}
            value={user.belt.length > 0 ? { label: user.belt } : ""}
            options={
              age(user) !== null && age(user) > 15
                ? adultBelts.map((belt) => ({ value: belt, label: belt }))
                : age(user) !== null && age(user) < 15
                ? kidBelts.map((belt) => ({ value: belt, label: belt }))
                : []
            }
            onChange={(e) => {
              e.length > 0
                ? setUser((state) => ({ ...state, belt: e[0].value }))
                : setUser((state) => ({ ...state, belt: "" }));

              setFormErrors((state) => ({
                ...state,
                belt:
                  e.length > 0 ? (e[0].value.length > 0 ? false : true) : true,
              }));
            }}
          ></Typeahead>
          <Form.Control.Feedback type="invalid">
            Please select a belt
          </Form.Control.Feedback>
        </Form.Group>

        <FloatingLabel
          label="Date you received this ranking"
          className="mb-3"
        >
          <Form.Control
            type="date"
            name="date"
            isValid={!formErrors.receivedDate}
            isInvalid={attemptedSubmit && formErrors.receivedDate}
            placeholder="Date"
            required
            value={user.receivedDate}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                receivedDate: e.target.value,
              }));
              setFormErrors((state) => ({
                ...state,
                receivedDate: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please choose a date
          </Form.Control.Feedback>
        </FloatingLabel>

        {/* <Form.Check
          className={`${styles.select} mb-3`}
          type="checkbox"
          name="role"
          label="I am a coach and need access to edit the calendar"
          checked={user.needWriteAccess}
          onChange={(e) =>
            setUser((state) => ({
              ...state,
              needWriteAccess: e.target.checked,
            }))
          }
        ></Form.Check> */}
        <Form.Group>
          <Typeahead
            multiple
            id="writeAccess"
            placeholder="Clubs that require access to edit the calendar"
            className={`mb-3 ${styles.select}`}
            isValid={!formErrors.needWriteAccess}
            isInvalid={attemptedSubmit && formErrors.needWriteAccess}
            selected={clubList.filter((item) =>
              user.needWriteAccess.includes(item.value)
            )}
            options={clubList.filter((club) =>
              user.clubId.includes(club.value)
            )}
            onChange={(e) => {
              setUser((state) => ({
                ...state,
                needWriteAccess: e.map((item) => item.value),
              }));

              setFormErrors((state) => ({
                ...state,
                needWriteAccess:
                  e.length > 0 ? (e.length > 0 ? false : true) : true,
              }));
            }}
          ></Typeahead>
          <Form.Control.Feedback type="invalid">
            Please enter a valid age
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          className="m-2"
          // onClick={() => {
          //   handleRegister();
          //   setUser(emptyUser);
          // }}
          type="submit"
        >
          Register
        </Button>
        <Button
          className="m-2"
          onClick={() => {
            setRegistering(false);
            setUser(emptyUser);
          }}
        >
          Back to Login
        </Button>
      </Form>
    </Card>
  );
}

export default Registration;
