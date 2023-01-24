import React from "react";

import {
  updateUserPermissions,
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

import { Typeahead } from "react-bootstrap-typeahead";

import Select from "react-select";

import styles from "./ControlPanel.module.css";

function ControlPanel({ props }) {
  const { controlPanelOpen, currentUser, setControlPanelOpen, clubList } =
    props;

  const [allUsers, setAllUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [usersNotShown, setUsersNotShown] = useState([]);

  // useEffect(() => {
  //   console.log(usersNotShown);
  // }, [usersNotShown]);

  useEffect(() => {
    fetchAllUsers().then((result) => {
      setAllUsers(result.data);
      setUserPermissions(result.data.map((item) => ({ ...item, updates: [] })));
    });
  }, []);

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
              <h6>Preferences</h6>
            </div>
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
                                  allUsers.filter(
                                    (user) =>
                                      user.needWriteAccess &&
                                      user.clubId.includes(club.value)
                                  ).length
                                }{" "}
                                users are requesting access
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
                                    <th>Calendar Editing</th>
                                    <th>Admin Rights</th>
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
                                                        onChange={(e) =>
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
                                                          )
                                                        }
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
