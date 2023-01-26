import React from "react";

import {
  updateUserPermissions,
  rejectPermissions,
  fetchAllUsers,
  updateUserClubs,
  updateUserPrefs,
} from "../requests/requests";

import { useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

import { PencilSquare, ArrowCounterclockwise } from "react-bootstrap-icons";

import { TextField, Autocomplete, InputAdornment } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { kidBelts, adultBelts, age } from "./../utils";

import styles from "./ControlPanel.module.css";

function ControlPanel({ props }) {
  const { controlPanelOpen, currentUser, setControlPanelOpen, clubList } =
    props;

  const [allUsers, setAllUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [usersNotShown, setUsersNotShown] = useState([]);
  const [newUserPrefs, setNewUserPrefs] = useState({ ...currentUser });
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [editingAlert, setEditingAlert] = useState(undefined);

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

  useEffect(() => {
    fetchAllUsers().then((result) => {
      setAllUsers(result.data);
      setUserPermissions(result.data.map((item) => ({ ...item, updates: [] })));
    });
    setNewUserPrefs(currentUser);
  }, []);

  useEffect(() => {
    setUsersNotShown(() => {
      return allUsers.map((user) => {
        return { ...user, clubId: [] };
      });
    });
  }, [allUsers]);

  //update permissions handler
  const handleUpdatePermissions = (userId, clubId, permission) => {
    setUserPermissions(
      userPermissions.map((user) => {
        if (user._id === userId) {
          const index = user[permission].findIndex((index) => index === clubId);

          let splicedArray = [...user[permission]];
          splicedArray.splice(index, 1);

          const updateIndex = user.updates.findIndex(
            (index) => index.clubId === clubId
          );

          let splicedUpdatesArray = [...user.updates];
          splicedUpdatesArray.splice(updateIndex, 1);

          return {
            ...user,
            [permission]: user[permission].includes(clubId)
              ? splicedArray
              : [...user[permission], clubId],
            updates:
              updateIndex === -1
                ? [...user.updates, { clubId: clubId, [permission]: true }]
                : user.updates.map((item) => {
                    if (item.clubId === clubId) {
                      return {
                        ...item,
                        [permission]: !item[permission],
                      };
                    } else {
                      return item;
                    }
                  }),
          };
        } else {
          return user;
        }
      })
    );
  };

  //handle rejection of permissions
  const handleRejectPermissions = async (user, club) => {
    setUserPermissions((state) => {
      return state.map((item) => {
        if (item._id === user._id) {
          return {
            ...item,
            needWriteAccess: [...item.needWriteAccess].filter(
              (value) => value !== club.value
            ),
          };
        } else {
          return item;
        }
      });
    });

    const result = await rejectPermissions(user, club);
  };

  //handle reset of permissions
  const handleResetPermissions = () => {
    setUserPermissions(allUsers.map((item) => ({ ...item, updates: [] })));
  };

  //handle submit of new permissions
  async function handleSubmitNewPermissions() {
    const result = await updateUserPermissions(userPermissions);

    if (result.status === 200) {
      fetchAllUsers().then((result) => {
        setAllUsers(result.data);
        setUserPermissions(
          result.data.map((item) => ({ ...item, updates: [] }))
        );
      });
    }
  }

  const handleAddUserToTable = () => {
    updateUserClubs(usersNotShown);
  };

  //handle updating user preferences

  const handleUpdateUserPreferences = async (newUserPrefs) => {
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
    <Modal show={controlPanelOpen}>
      <Card className={styles.modalContainer}>
        <div className={styles.buttons}>
          <CloseButton
            onClick={() => {
              setControlPanelOpen(false);
            }}
          />
        </div>
        <div className={styles.wrapper}>
          <Card className={`${styles.sideBar} p-2`}>
            <div className={styles.header}>
              <h4>Welcome {currentUser.firstName}</h4>
            </div>
            <div className={styles.header}>
              {editingAlert === true ? (
                <Alert variant="success">
                  Updated preferences successfully
                </Alert>
              ) : editingAlert === false ? (
                <Alert variant="danger">
                  There was an error updating your preferences, please try again
                </Alert>
              ) : null}
              <h6>
                Preferences{" "}
                {editingPrefs ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleUpdateUserPreferences(newUserPrefs);
                      }}
                      className={styles.editPrefsButton}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setEditingPrefs(false);
                        setNewUserPrefs(currentUser);
                      }}
                      className={styles.editPrefsButton}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <PencilSquare
                    onClick={() => setEditingPrefs(true)}
                    className={styles.editPrefs}
                  />
                )}
              </h6>
            </div>
            {editingPrefs ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Table
                  striped
                  bordered
                >
                  <tbody>
                    <tr>
                      <th>First Name</th>
                      <td>
                        <TextField
                          className={`${styles.input} mt-2 mb-1`}
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
                                  <ArrowCounterclockwise
                                    className={styles.undo}
                                  />
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
                      </td>
                    </tr>
                    <tr>
                      <th>Last Name</th>
                      <td>
                        <TextField
                          className={`${styles.input} mt-2 mb-1`}
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
                                  <ArrowCounterclockwise
                                    className={styles.undo}
                                  />
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
                      </td>
                    </tr>
                    <tr>
                      <th>E-Mail</th>
                      <td>
                        <TextField
                          className={`${styles.input} mt-2 mb-1`}
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
                      </td>
                    </tr>
                    <tr>
                      <th>Birthday</th>
                      <td>
                        <DatePicker
                          className={`${styles.input} mt-2 mb-1`}
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
                      </td>
                    </tr>
                    <tr>
                      <th>Club Affiliations</th>
                      <td>
                        <Autocomplete
                          className={`${styles.input} mt-2 mb-1`}
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
                      </td>
                    </tr>
                    <tr>
                      <th>Primary Club</th>
                      <td>
                        <Autocomplete
                          className={`${styles.input} mt-2 mb-1`}
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
                      </td>
                    </tr>

                    <tr>
                      <th>Belt/Date</th>
                      <td>
                        <Autocomplete
                          id="belt-selection"
                          className={`${styles.input} mt-2 mb-1`}
                          value={newUserPrefs.belt}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value || value === ""
                          }
                          options={
                            age(newUserPrefs) !== null && age(newUserPrefs) > 15
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
                            console.log(e, value);
                            setNewUserPrefs((state) => ({
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
                          className={`${styles.input} mt-2 mb-1`}
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
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </LocalizationProvider>
            ) : (
              <Table
                striped
                bordered
              >
                <tbody>
                  <tr>
                    <th>First Name</th>
                    <td>{currentUser.firstName}</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td>{currentUser.lastName}</td>
                  </tr>
                  <tr>
                    <th>E-Mail</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th>Birthday</th>
                    <td>{`${new Date(currentUser.birthday).getFullYear()}-${
                      new Date(currentUser.birthday).getMonth() < 9
                        ? "0" + (new Date(currentUser.birthday).getMonth() + 1)
                        : new Date(currentUser.birthday).getMonth() + 1
                    }-${new Date(currentUser.birthday).getDate()}`}</td>
                  </tr>
                  <tr>
                    <th>Club Affiliations</th>
                    <td>
                      {currentUser.clubId.map((id) => (
                        <div key={id}>
                          {clubList.find((club) => club.value === id).label}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Primary Club</th>
                    <td>
                      {
                        clubList.find(
                          (club) => club.value === currentUser.defaultClub
                        ).label
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>Belt/Date</th>
                    <td>
                      {currentUser.belt} /{" "}
                      {`${new Date(currentUser.receivedDate).getFullYear()}-${
                        new Date(currentUser.receivedDate).getMonth() < 9
                          ? "0" +
                            (new Date(currentUser.receivedDate).getMonth() + 1)
                          : new Date(currentUser.receivedDate).getMonth() + 1
                      }-${new Date(currentUser.receivedDate).getDate()}`}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}

            <div className={styles.header}>
              <h6>Roles/Access</h6>
            </div>
            <Table
              striped
              bordered
            >
              <tbody>
                <tr>
                  <th>Coach</th>
                  <td>
                    {currentUser.coach.map((id) => (
                      <div key={id}>
                        {clubList.find((club) => club.value === id).label}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>Write Access</th>
                  <td>
                    {currentUser.writeAccess.map((id) => (
                      <div key={id}>
                        {clubList.find((club) => club.value === id).label}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>Admin Rights</th>
                  <td>
                    {currentUser.admin.map((id) => (
                      <div key={id}>
                        {clubList.find((club) => club.value === id).label}
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
          <Card className={styles.clubCard}>
            <div className={styles.header}>
              <h4>Clubs you manage</h4>
            </div>
            {clubList.length === 0
              ? null
              : clubList.map((club) => {
                  if (currentUser.admin.includes(club.value)) {
                    return (
                      <div
                        key={club.value}
                        className={styles.clubContainer}
                      >
                        <Accordion className={styles.accordion}>
                          <Accordion.Header>
                            <div className={styles.accordionHeader}>
                              <div>{club.label}</div>
                              <Badge
                                bg="success"
                                className={styles.accessRequest}
                              >
                                {
                                  allUsers.filter((user) =>
                                    user.needWriteAccess.includes(club.value)
                                  ).length
                                }{" "}
                                user
                                {(allUsers.filter((user) =>
                                  user.needWriteAccess.includes(club.value)
                                ).length >
                                  1) |
                                (allUsers.filter((user) =>
                                  user.needWriteAccess.includes(club.value)
                                ).length ===
                                  0)
                                  ? "s are "
                                  : " is "}
                                requesting access
                              </Badge>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Form>
                              <Table
                                striped
                                bordered
                                className={styles.table}
                              >
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Rank</th>
                                    <th>Coach</th>
                                    <th>Calendar Edits</th>
                                    <th>Admin</th>
                                    <th>Access Request</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userPermissions.length === 0
                                    ? null
                                    : []
                                        .concat(userPermissions)
                                        .sort((a, b) =>
                                          a.lastName.toLowerCase() >
                                          b.lastName.toLowerCase()
                                            ? 1
                                            : -1
                                        )
                                        .map((user) => {
                                          const fields = [
                                            "coach",
                                            "writeAccess",
                                            "admin",
                                          ];

                                          const userFields = fields.map(
                                            (field, index) => {
                                              return (
                                                <td
                                                  key={index}
                                                  permission={field}
                                                  className={`
                                      ${styles.cell}
                                      ${
                                        user.updates.find(
                                          (object) =>
                                            object.clubId === club.value
                                        ) &&
                                        user.updates
                                          .find(
                                            (object) =>
                                              object.clubId === club.value
                                          )
                                          .hasOwnProperty(field) &&
                                        user.updates.find(
                                          (object) =>
                                            object.clubId === club.value
                                        )[field]
                                          ? styles.updated
                                          : ""
                                      }`}
                                                >
                                                  {
                                                    <>
                                                      <Form.Check
                                                        className={
                                                          styles.checkBox
                                                        }
                                                        checked={user[
                                                          field
                                                        ].includes(club.value)}
                                                        onChange={(e) => {
                                                          handleUpdatePermissions(
                                                            e.currentTarget.closest(
                                                              "tr"
                                                            ).id,
                                                            e.currentTarget
                                                              .closest("tr")
                                                              .getAttribute(
                                                                "clubid"
                                                              ),
                                                            e.currentTarget
                                                              .closest("td")
                                                              .getAttribute(
                                                                "permission"
                                                              ),
                                                            "remove"
                                                          );
                                                          handleRejectPermissions(
                                                            user,
                                                            club
                                                          );
                                                        }}
                                                      ></Form.Check>
                                                    </>
                                                  }
                                                </td>
                                              );
                                            }
                                          );

                                          if (
                                            user.clubId.includes(club.value)
                                          ) {
                                            return (
                                              <tr
                                                key={user._id}
                                                id={user._id}
                                                clubid={club.value}
                                              >
                                                <td>
                                                  {user.firstName}{" "}
                                                  {user.lastName}
                                                </td>
                                                <td>{user.belt}</td>
                                                {userFields}
                                                <td>
                                                  {user.needWriteAccess.includes(
                                                    club.value
                                                  ) ? (
                                                    <Button
                                                      size="sm"
                                                      variant="danger"
                                                      className={styles.reject}
                                                      onClick={() => {
                                                        handleRejectPermissions(
                                                          user,
                                                          club
                                                        );
                                                      }}
                                                    >
                                                      Reject
                                                    </Button>
                                                  ) : null}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        })}
                                </tbody>
                              </Table>
                              {/* <div>Add rights for unlisted users</div> */}
                              {/* <Typeahead
                                id="AddUsers"
                                // selected={[]
                                //   .concat(usersNotShown)
                                //   .map((user) => {
                                //     if (user.clubId.includes(club.value)) {
                                //       return {
                                //         value: user._id,
                                //         label: `${user.firstName} ${user.lastName}`,
                                //       };
                                //     } else {
                                //       return undefined;
                                //     }
                                //   })
                                //   .filter((item) => item !== undefined)}
                                multiple
                                options={allUsers
                                  .map((user) => {
                                    if (!user.clubId.includes(club.value)) {
                                      return {
                                        value: user._id,
                                        label: `${user.firstName} ${
                                          user.lastName
                                        } (${
                                          clubList.find(
                                            (id) =>
                                              id.value === user.defaultClub
                                          ).label
                                        })`,
                                      };
                                    }
                                  })
                                  .filter((item) => item !== undefined)}
                                // onChange={(e) =>
                                //   setUsersNotShown((state) => [
                                //     ...e.map((newUser) => {
                                //       let result = allUsers.find(
                                //         (item) => item._id === newUser.value
                                //       );

                                //       result.clubId = [
                                //         ...state.find(
                                //           (object) =>
                                //             object._id === newUser.value
                                //         ).clubId,
                                //         club.value,
                                //       ];
                                //       return result;
                                //     }),
                                //   ])
                                // }
                                onChange={(e) => {
                                  setUsersNotShown((state) => {
                                    let result = [...state];
                                    e.forEach((item) => {
                                      const index = state.findIndex(
                                        (i) => i._id === item.value
                                      );
                                      result[index].clubId = [
                                        ...result[index].clubId,
                                        item.value,
                                      ];
                                    });
                                    return result;
                                  });
                                }}
                              ></Typeahead>
                              <Button onClick={() => handleAddUserToTable()}>
                                Add
                              </Button> */}
                            </Form>
                          </Accordion.Body>
                        </Accordion>
                      </div>
                    );
                  }
                })}
          </Card>
        </div>
        <div className={styles.buttons}>
          <Button
            variant="danger"
            onClick={() => handleResetPermissions()}
          >
            Reset All
          </Button>{" "}
          <Button
            variant="success"
            onClick={() => {
              handleSubmitNewPermissions();
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </Modal>
  );
}

export default ControlPanel;
