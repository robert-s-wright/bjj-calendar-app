import React from "react";

import {
  updateUserPermissions,
  rejectPermissions,
  fetchAllUsers,
  updateUserClubs,
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
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

import { PencilSquare } from "react-bootstrap-icons";

import { TextField, Autocomplete } from "@mui/material";

import { Typeahead } from "react-bootstrap-typeahead";

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
  const [editingPrefs, setEditingPrefs] = useState(true);
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

  useEffect(() => {
    fetchAllUsers().then((result) => {
      setAllUsers(result.data);
      setUserPermissions(result.data.map((item) => ({ ...item, updates: [] })));
    });
    setNewUserPrefs(currentUser);
  }, []);

  useEffect(() => {
    // console.log(newUserPrefs);
    // console.log(clubList);
  }, [newUserPrefs]);

  useEffect(() => {
    setUsersNotShown(() => {
      return allUsers.map((user) => {
        return { ...user, clubId: [] };
      });
    });
  }, [allUsers]);

  const handleUpdate = (userId, clubId, permission) => {
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

  const handleReject = async (user, club) => {
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

    // console.log(result);
  };

  // useEffect(() => {
  //   console.log(userPermissions);
  // }, userPermissions);

  const handleReset = () => {
    setUserPermissions(allUsers.map((item) => ({ ...item, updates: [] })));
  };

  async function handleSubmit() {
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
              <h6>
                Preferences{" "}
                {editingPrefs ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => setEditingPrefs(false)}
                      className={styles.editPrefsButton}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setEditingPrefs(false)}
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
                <Form
                  noValidate
                  validated={validated}
                  // onSubmit={handleRegister}
                  className={styles.form}
                >
                  <Table
                    striped
                    bordered
                  >
                    <tbody>
                      <tr>
                        <th>First Name</th>
                        <td>
                          <TextField
                            className={styles.input}
                            error={attemptedSubmit && formErrors.firstName}
                            placeholder="First Name"
                            value={newUserPrefs.firstName}
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
                            className={styles.input}
                            placeholder="Last Name"
                            error={attemptedSubmit && formErrors.lastName}
                            helperText={
                              attemptedSubmit && formErrors.lastName
                                ? "Please enter your last name"
                                : false
                            }
                            required
                            value={newUserPrefs.lastName}
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
                            className={styles.input}
                            placeholder="E-Mail"
                            error={attemptedSubmit && formErrors.email}
                            helperText={
                              attemptedSubmit && formErrors.email
                                ? "Please enter a valid e-mail"
                                : false
                            }
                            value={newUserPrefs.email}
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
                        <th>Club Affiliations</th>
                        <td>
                          <Autocomplete
                            className={styles.input}
                            multiple
                            id="clubSelection"
                            placeholder="Select clubs you are affiliated with"
                            options={clubList}
                            value={clubList.filter((club) =>
                              newUserPrefs.clubId.includes(club.value)
                            )}
                            onChange={(e, newValue) => {
                              console.log(e, newValue);
                              setNewUserPrefs((state) => ({
                                ...state,
                                clubId: newValue.map((club) => club.value),
                              }));
                              setFormErrors((state) => ({
                                ...state,
                                clubId: newValue.length > 0 ? false : true,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                helperText={
                                  attemptedSubmit && formErrors.clubId
                                    ? "Please select at least 1 club affiliation"
                                    : false
                                }
                                error={attemptedSubmit && formErrors.clubId}
                                {...params}
                              />
                            )}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Primary Club</th>
                        <td>
                          <Autocomplete
                            className={styles.input}
                            id="primary-club"
                            placeholder="Select your primary club"
                            error={attemptedSubmit && formErrors.defaultClub}
                            options={clubList.filter((club) =>
                              newUserPrefs.clubId.includes(club.value)
                            )}
                            value={
                              newUserPrefs.defaultClub === ""
                                ? ""
                                : clubList.find(
                                    (club) =>
                                      club.value === newUserPrefs.defaultClub
                                  ).label
                            }
                            onChange={(e, newValue) => {
                              console.log(newValue);
                              setNewUserPrefs((state) => ({
                                ...state,
                                defaultClub:
                                  newValue !== null ? newValue.value : "",
                              }));
                              setFormErrors((state) => ({
                                ...state,
                                defaultClub: newValue !== null ? false : true,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                helperText={
                                  attemptedSubmit && formErrors.clubId
                                    ? "Please select a primary club"
                                    : false
                                }
                                error={
                                  attemptedSubmit && formErrors.defaultClub
                                }
                                {...params}
                              />
                            )}
                          />
                        </td>
                      </tr>

                      <tr>
                        <th>Birthday</th>
                        <td>
                          <DatePicker
                            className={styles.date}
                            inputFormat="DD/MM/YYYY"
                            placeholder="Select Your Birthday"
                            value={newUserPrefs.birthday}
                            disableFuture
                            onError={(error) =>
                              setFormErrors((state) => ({
                                ...state,
                                birthday: error !== null ? true : false,
                              }))
                            }
                            onChange={(e) => {
                              setNewUserPrefs((state) => ({
                                ...state,
                                birthday: e,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                error={attemptedSubmit && formErrors.birthday}
                                {...params}
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
                        <th>Belt/Date</th>
                        <td>
                          <Autocomplete
                            id="beltSelection"
                            placeholder="Select your belt"
                            className={styles.input}
                            value={
                              newUserPrefs.belt.length > 0
                                ? { label: newUserPrefs.belt }
                                : ""
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
                            onChange={(e) => {
                              setNewUserPrefs((state) => ({
                                ...state,
                                belt: e.length > 0 ? e[0].value : "",
                              }));

                              setFormErrors((state) => ({
                                ...state,
                                belt:
                                  e.length > 0
                                    ? e[0].value.length > 0
                                      ? false
                                      : true
                                    : true,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                error={attemptedSubmit && formErrors.belt}
                                {...params}
                                helperText={
                                  attemptedSubmit && formErrors.belt
                                    ? "Please select a belt"
                                    : false
                                }
                              />
                            )}
                          />

                          <DatePicker
                            className={styles.date}
                            placeholder="Select Your Birthday"
                            inputFormat="DD/MM/YYYY"
                            value={newUserPrefs.receivedDate}
                            disableFuture
                            onError={(error) =>
                              setFormErrors((state) => ({
                                ...state,
                                receivedDate: error !== null ? true : false,
                              }))
                            }
                            onChange={(e) => {
                              setNewUserPrefs((state) => ({
                                ...state,
                                receivedDate: e,
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  attemptedSubmit && formErrors.receivedDate
                                }
                                helperText={
                                  attemptedSubmit && formErrors.receivedDate
                                    ? "You may not select a future date"
                                    : false
                                }
                                {...params}
                              />
                            )}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Form>
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
                    <th>E-Mail</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th>Birthday</th>
                    <td>{currentUser.birthday}</td>
                  </tr>
                  <tr>
                    <th>Belt/Date</th>
                    <td>
                      {currentUser.belt} / {currentUser.receivedDate}
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
                                                          handleUpdate(
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
                                                          handleReject(
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
                                                        handleReject(
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
            onClick={() => handleReset()}
          >
            Reset All
          </Button>{" "}
          <Button
            variant="success"
            onClick={() => {
              handleSubmit();
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
