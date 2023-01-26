import React from "react";

import { useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { TextField, Autocomplete } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { registerUser } from "../requests/requests";

import { kidBelts, adultBelts, age } from "./../utils";

import styles from "./Registration.module.css";

function Registration(props) {
  const { setRegistering, clubList } = props;

  const emptyUser = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    birthday: null,
    clubId: [],
    belt: null,
    receivedDate: null,
    needWriteAccess: [],
    defaultClub: null,
  };

  const [user, setUser] = useState(emptyUser);

  const [registerSuccess, setRegisterSuccess] = useState(undefined);

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
    defaultClub: true,
  });

  const handleRegister = async (e) => {
    setAttemptedSubmit(true);

    if (Object.values(formErrors).some((value) => value === true)) {
      console.log(formErrors);
      return;
    } else {
      const result = await registerUser(user);

      if (result.data) {
        setRegisterSuccess(true);
        setUser(emptyUser);
      } else {
        setRegisterSuccess(false);
      }
      setTimeout(() => {
        setRegisterSuccess(undefined);
      }, 3000);
    }
  };

  return (
    <Card className={`p-3 ${styles.card}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                This e-mail is already associated with an account, please
                proceed to the login page.
              </Alert>
            ),
            undefined: null,
          }[registerSuccess]
        }

        <TextField
          error={attemptedSubmit && formErrors.firstName}
          className={`${styles.input} mb-3`}
          type="text"
          id="firstname"
          label="First Name"
          required={true}
          value={user.firstName ? user.firstName : ""}
          onChange={(e) => {
            setUser((state) => ({
              ...state,
              firstName: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              firstName: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.firstName
              ? "Please enter your first name"
              : false
          }
        />

        <TextField
          className={`${styles.input} mb-3`}
          // type="text"
          name="lastname"
          id="lastname"
          label="Last Name"
          error={attemptedSubmit && formErrors.lastName}
          helperText={
            attemptedSubmit && formErrors.lastName
              ? "Please enter your last name"
              : false
          }
          required
          value={user.lastName ? user.lastName : ""}
          onChange={(e) => {
            setUser((state) => ({
              ...state,
              lastName: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              lastName: e.target.value.length > 0 ? false : true,
            }));
          }}
        />

        <TextField
          className={`${styles.input} mb-3`}
          type="email"
          name="email"
          id="email"
          label="E-Mail"
          required
          error={attemptedSubmit && formErrors.email}
          helperText={
            attemptedSubmit && formErrors.email
              ? "Please enter a valid e-mail"
              : false
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
          className={`${styles.input} mb-3`}
          name="password"
          type="password"
          id="password"
          label="Password"
          required
          error={attemptedSubmit && formErrors.password}
          helperText={
            "Must contain at least 8 characters and contain at least 1 uppercase letter and 1 number"
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
        <DatePicker
          className={`${styles.input} mb-3`}
          name="birthday"
          type="date"
          id="birthday"
          label="Your Birthday"
          inputFormat="YYYY/MM/DD"
          value={user.birthday}
          disableFuture
          onError={(error) => {
            setFormErrors((state) => ({
              ...state,
              birthday: error !== null ? true : false,
            }));
          }}
          onChange={(e) => {
            setUser((state) => ({
              ...state,
              birthday: e,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={attemptedSubmit && formErrors.birthday}
              required
              helperText={
                attemptedSubmit && formErrors.birthday
                  ? "You may not select a future date"
                  : false
              }
            />
          )}
        />
        <Autocomplete
          className={`${styles.input} mb-3`}
          multiple
          id="club-affiliations"
          options={clubList}
          value={clubList.filter((club) => user.clubId.includes(club.value))}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value || value.value === ""
          }
          onChange={(e, newValue) => {
            setUser((state) => ({
              ...state,
              clubId: newValue.map((club) => club.value),
              defaultClub: newValue.some(
                (obj) => obj.value === state.defaultClub
              )
                ? state.defaultClub
                : null,
              needWriteAccess: state.needWriteAccess
                .map((item) =>
                  newValue.some((obj) => obj.value === item) ? item : undefined
                )
                .filter((item) => item !== undefined),
            }));
            setFormErrors((state) => ({
              ...state,
              clubId: newValue.length > 0 ? false : true,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="All clubs you are affiliated with"
              helperText={
                attemptedSubmit && formErrors.clubId
                  ? "Please select at least 1 club affiliation"
                  : false
              }
              error={attemptedSubmit && formErrors.clubId}
            />
          )}
        />

        <Autocomplete
          className={`${styles.input} mb-3`}
          disabled={user.clubId.length === 0}
          id="primary-club"
          options={clubList.filter((club) => user.clubId.includes(club.value))}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value || value === null
          }
          value={
            user.defaultClub === null
              ? null
              : clubList.find((club) => club.value === user.defaultClub)
          }
          onChange={(e, newValue) => {
            setUser((state) => ({
              ...state,
              defaultClub: newValue !== null ? newValue.value : null,
            }));
            setFormErrors((state) => ({
              ...state,
              defaultClub: newValue !== null ? false : true,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              error={attemptedSubmit && formErrors.defaultClub}
              label="Your Primary Club"
              helperText={
                attemptedSubmit && formErrors.clubId
                  ? "Please select a primary club"
                  : false
              }
            />
          )}
        />
        <Autocomplete
          id="belt-selection"
          className={`${styles.input} mb-3`}
          value={user.belt}
          isOptionEqualToValue={(option, value) =>
            option.value === value || value === ""
          }
          options={
            age(user) !== null && age(user) > 15
              ? adultBelts.map((belt) => ({
                  value: belt,
                  label: belt,
                }))
              : age(user) !== null && age(user) < 15
              ? kidBelts.map((belt) => ({
                  value: belt,
                  label: belt,
                }))
              : []
          }
          onChange={(e, value) => {
            console.log(e, value);
            setUser((state) => ({
              ...state,
              belt: value.value,
            }));

            setFormErrors((state) => ({
              ...state,
              belt: value === null ? true : false,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Your Belt Rank"
              error={attemptedSubmit && formErrors.belt}
              helperText={
                attemptedSubmit && formErrors.belt
                  ? "Please select a belt"
                  : false
              }
            />
          )}
        />

        <DatePicker
          className={`${styles.input} mb-3`}
          id="belt-received-date"
          label="Date you received this rank"
          inputFormat="YYYY/MM/DD"
          disabled={user.belt === null}
          value={user.receivedDate}
          disableFuture
          onError={(error) =>
            setFormErrors((state) => ({
              ...state,
              receivedDate: error !== null ? true : false,
            }))
          }
          onChange={(e) => {
            setUser((state) => ({
              ...state,
              receivedDate: e,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              error={attemptedSubmit && formErrors.receivedDate}
              helperText={
                attemptedSubmit && formErrors.receivedDate
                  ? "You must enter a date but may not select a future date"
                  : false
              }
            />
          )}
        />
        <Autocomplete
          className={`${styles.input} mb-3`}
          disabled={user.clubId.length === 0}
          multiple
          required
          id="club-write-access"
          options={clubList.filter((club) => user.clubId.includes(club.value))}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value || value === ""
          }
          value={clubList.filter((club) =>
            user.needWriteAccess.includes(club.value)
          )}
          onChange={(e, newValue) => {
            setUser((state) => ({
              ...state,
              needWriteAccess: newValue.map((club) => club.value),
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Clubs that you require write access to the calendar"
            />
          )}
        />

        <Button
          className="m-2"
          onClick={() => {
            handleRegister();
          }}
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
      </LocalizationProvider>
    </Card>
  );
}

export default Registration;
