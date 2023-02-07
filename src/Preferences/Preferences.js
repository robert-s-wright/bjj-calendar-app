import React, { useState, useEffect } from "react";

import { updateUserPrefs } from "../requests/requests";

import {
  Card,
  Alert,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Autocomplete,
  IconButton,
  TableHead,
  Paper,
  Collapse,
  Grow,
  Zoom,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { kidBelts, adultBelts, age } from "./../utils";

import styles from "./Preferences.module.css";

function Preferences({ currentUser, clubList }) {
  const [newUserPrefs, setNewUserPrefs] = useState({ ...currentUser });
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [editingAlert, setEditingAlert] = useState(undefined);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthday: false,
    clubId: false,
    belt: false,
    receivedDate: false,
    needWriteAccess: false,
    defaultClub: false,
  });

  const inputStyling = {
    input: {
      fontSize: "14px",
    },

    span: {
      fontSize: "12px",
    },
    svg: {
      fontSize: "18px",
    },
    ".MuiChip-deleteIcon": {
      fontSize: "18px",
    },
  };

  useEffect(() => {
    setNewUserPrefs(currentUser);
  }, []);

  //handle updating user preferences

  const handleUpdateUserPreferences = async (newUserPrefs) => {
    setAttemptedSubmit(true);
    const result = await updateUserPrefs(newUserPrefs);

    if (result.data.acknowledged && result.data.modifiedCount === 1) {
      setEditingAlert(true);
    } else {
      setEditingAlert(false);
    }
    setEditingAlert(true);
    setTimeout(() => {
      setEditingAlert(undefined);
    }, 3000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          Welcome {currentUser.firstName}
          {editingAlert === true ? (
            <Alert variant="success">Updated preferences successfully</Alert>
          ) : editingAlert === false ? (
            <Alert variant="danger">
              There was an error updating your preferences, please try again
            </Alert>
          ) : null}
        </div>
        <div className={styles.flexContainer}>
          <div className={styles.container}>
            <Paper
              sx={{
                "&.MuiPaper-root": {
                  padding: "8px 16px 16px !important",
                },
              }}
            >
              <Table
                size="small"
                className={styles.table}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan="2"
                    >
                      <h3>
                        Preferences
                        <Grow in={!editingPrefs}>
                          <IconButton onClick={() => setEditingPrefs(true)}>
                            <EditIcon />
                          </IconButton>
                        </Grow>
                      </h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      First Name
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <TextField
                          className={styles.input}
                          sx={inputStyling}
                          size="small"
                          margin="dense"
                          error={attemptedSubmit && formErrors.firstName}
                          type="text"
                          name="firstname"
                          id="firstname"
                          label="First Name"
                          required
                          InputProps={{
                            endAdornment:
                              newUserPrefs.firstName ===
                              currentUser.firstName ? null : (
                                <InputAdornment>
                                  <UndoIcon className={styles.undo} />
                                </InputAdornment>
                              ),
                          }}
                          value={
                            newUserPrefs.firstName ? newUserPrefs.firstName : ""
                          }
                          onChange={(e) => {
                            setNewUserPrefs((state) => ({
                              ...state,
                              firstName: e.target.value,
                            }));
                            setFormErrors((state) => ({
                              ...state,
                              firstName:
                                e.target.value.length > 0 ? false : true,
                            }));
                          }}
                          helperText={
                            attemptedSubmit && formErrors.firstName
                              ? "Please enter your first name"
                              : false
                          }
                        />
                      </Collapse>

                      <Collapse in={!editingPrefs}>
                        <div>{currentUser.firstName}</div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      Last Name
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <TextField
                          className={styles.input}
                          sx={inputStyling}
                          size="small"
                          margin="dense"
                          type="text"
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
                          InputProps={{
                            endAdornment:
                              newUserPrefs.lastName ===
                              currentUser.lastName ? null : (
                                <InputAdornment>
                                  <UndoIcon className={styles.undo} />
                                </InputAdornment>
                              ),
                          }}
                          value={
                            newUserPrefs.lastName ? newUserPrefs.lastName : ""
                          }
                          onChange={(e) => {
                            setNewUserPrefs((state) => ({
                              ...state,
                              lastName: e.target.value,
                            }));
                            setFormErrors((state) => ({
                              ...state,
                              lastName:
                                e.target.value.length > 0 ? false : true,
                            }));
                          }}
                        />
                      </Collapse>

                      <Collapse in={!editingPrefs}>
                        <div>{currentUser.lastName}</div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      E-Mail
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <TextField
                          className={styles.input}
                          sx={inputStyling}
                          size="small"
                          margin="dense"
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
                          value={newUserPrefs.email ? newUserPrefs.email : ""}
                          onChange={(e) => {
                            setNewUserPrefs((state) => ({
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
                      </Collapse>
                      <Collapse in={!editingPrefs}>
                        <div>{currentUser.email}</div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      Birthday
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <DatePicker
                          className={styles.input}
                          name="birthday"
                          type="date"
                          id="birthday"
                          label="Your Birthday"
                          inputFormat="YYYY/MM/DD"
                          value={newUserPrefs.birthday}
                          disableFuture
                          onError={(error) => {
                            setFormErrors((state) => ({
                              ...state,
                              birthday: error !== null ? true : false,
                            }));
                          }}
                          onChange={(e) => {
                            setNewUserPrefs((state) => ({
                              ...state,
                              birthday: e,
                              belt: e === null ? null : state.belt,
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={inputStyling}
                              size="small"
                              margin="dense"
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
                      </Collapse>
                      <Collapse in={!editingPrefs}>
                        <div>
                          {`${new Date(currentUser.birthday).getFullYear()}-${
                            new Date(currentUser.birthday).getMonth() < 9
                              ? "0" +
                                (new Date(currentUser.birthday).getMonth() + 1)
                              : new Date(currentUser.birthday).getMonth() + 1
                          }-${new Date(currentUser.birthday).getDate()}`}
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      Club Affiliations
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <Autocomplete
                          className={styles.input}
                          multiple
                          id="club-affiliations"
                          options={clubList}
                          value={clubList.filter((club) =>
                            newUserPrefs.clubId.includes(club.value)
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value || value.value === ""
                          }
                          onChange={(e, newValue) => {
                            setNewUserPrefs((state) => ({
                              ...state,
                              clubId: newValue.map((club) => club.value),
                              defaultClub: newValue.some(
                                (obj) => obj.value === state.defaultClub
                              )
                                ? state.defaultClub
                                : null,
                              needWriteAccess: state.needWriteAccess
                                .map((item) =>
                                  newValue.some((obj) => obj.value === item)
                                    ? item
                                    : undefined
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
                              sx={inputStyling}
                              size="small"
                              margin="dense"
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
                      </Collapse>
                      <Collapse in={!editingPrefs}>
                        {currentUser.clubId.map((id) => (
                          <div key={id}>
                            {clubList.find((club) => club.value === id).label}
                          </div>
                        ))}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      Primary Club
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <Autocomplete
                          className={styles.input}
                          disabled={newUserPrefs.clubId.length === 0}
                          id="primary-club"
                          options={clubList.filter((club) =>
                            newUserPrefs.clubId.includes(club.value)
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value || value === null
                          }
                          value={
                            newUserPrefs.defaultClub === null
                              ? null
                              : clubList.find(
                                  (club) =>
                                    club.value === newUserPrefs.defaultClub
                                )
                          }
                          onChange={(e, newValue) => {
                            setNewUserPrefs((state) => ({
                              ...state,
                              defaultClub:
                                newValue !== null ? newValue.value : null,
                            }));
                            setFormErrors((state) => ({
                              ...state,
                              defaultClub: newValue !== null ? false : true,
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={inputStyling}
                              size="small"
                              margin="dense"
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
                      </Collapse>
                      <Collapse in={!editingPrefs}>
                        <div>
                          {
                            clubList.find(
                              (club) => club.value === currentUser.defaultClub
                            ).label
                          }
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      align="center"
                      className={styles.bold}
                    >
                      Belt/Date
                    </TableCell>
                    <TableCell align="center">
                      <Collapse in={editingPrefs}>
                        <>
                          <Autocomplete
                            className={styles.input}
                            id="belt-selection"
                            value={newUserPrefs.belt}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value || value === ""
                            }
                            options={
                              age(newUserPrefs) !== null &&
                              age(newUserPrefs) > 15
                                ? adultBelts.map((belt) => ({
                                    value: belt,
                                    label: belt,
                                  }))
                                : age(newUserPrefs) !== null &&
                                  age(newUserPrefs) < 15
                                ? kidBelts.map((belt) => ({
                                    value: belt,
                                    label: belt,
                                  }))
                                : []
                            }
                            onChange={(e, value) => {
                              setNewUserPrefs((state) => ({
                                ...state,
                                belt: value ? value.value : null,
                              }));

                              setFormErrors((state) => ({
                                ...state,
                                belt: value === null ? true : false,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={inputStyling}
                                size="small"
                                margin="dense"
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
                            className={styles.input}
                            name="birthday"
                            type="date"
                            id="birthday"
                            label="Your Birthday"
                            inputFormat="YYYY/MM/DD"
                            value={newUserPrefs.birthday}
                            disableFuture
                            onError={(error) => {
                              setFormErrors((state) => ({
                                ...state,
                                birthday: error !== null ? true : false,
                              }));
                            }}
                            onChange={(e) => {
                              setNewUserPrefs((state) => ({
                                ...state,
                                birthday: e,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={inputStyling}
                                // className={styles.input}
                                size="small"
                                margin="dense"
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
                        </>
                      </Collapse>
                      <Collapse in={!editingPrefs}>
                        <div>
                          {currentUser.belt} /{" "}
                          {`${new Date(
                            currentUser.receivedDate
                          ).getFullYear()}-${
                            new Date(currentUser.receivedDate).getMonth() < 9
                              ? "0" +
                                (new Date(currentUser.receivedDate).getMonth() +
                                  1)
                              : new Date(currentUser.receivedDate).getMonth() +
                                1
                          }-${new Date(currentUser.receivedDate).getDate()}`}
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            <Collapse in={editingPrefs}>
              <div className={styles.preferencesButtons}>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    handleUpdateUserPreferences(newUserPrefs);
                  }}
                  className={styles.editPrefsButton}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  color="danger"
                  variant="contained"
                  onClick={() => {
                    setEditingPrefs(false);
                    setNewUserPrefs(currentUser);
                  }}
                  className={styles.editPrefsButton}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </Collapse>
          </div>
          <Paper
            className={styles.rolesContainer}
            sx={{
              "&.MuiPaper-root": {
                padding: "8px 16px 16px !important",
              },
            }}
          >
            <Table
              className={styles.table}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan="2"
                  >
                    <h3>Roles / Access</h3>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    align="center"
                    className={styles.bold}
                  >
                    Coach
                  </TableCell>
                  <TableCell align="center">
                    {currentUser.coach.length > 0 ? (
                      currentUser.coach.map((id) => (
                        <div key={id}>
                          {clubList.find((club) => club.value === id).label}
                        </div>
                      ))
                    ) : (
                      <div>None Assigned</div>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    className={styles.bold}
                  >
                    Write Access
                  </TableCell>
                  <TableCell align="center">
                    {currentUser.writeAccess.length > 0 ? (
                      currentUser.writeAccess.map((id) => (
                        <div key={id}>
                          {clubList.find((club) => club.value === id).label}
                        </div>
                      ))
                    ) : (
                      <div>None Assigned</div>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    className={styles.bold}
                  >
                    Admin Rights
                  </TableCell>
                  <TableCell align="center">
                    {currentUser.admin.length > 0 ? (
                      currentUser.admin.map((id) => (
                        <div key={id}>
                          {clubList.find((club) => club.value === id).label}
                        </div>
                      ))
                    ) : (
                      <div>None Assigned</div>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Preferences;
