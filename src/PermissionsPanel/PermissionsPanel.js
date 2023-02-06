import React, { useState, useEffect } from "react";

import {
  updateUserPermissions,
  rejectPermissions,
  fetchAllUsers,
} from "../requests/requests";

// import Badge from "react-bootstrap/esm/Badge";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Checkbox,
  Badge,
  Alert,
  Collapse,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import styles from "./PermissonsPanel.module.css";

function PermissionsPanel({ clubList, currentUser, setCurrentUser }) {
  const [allUsers, setAllUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    fetchAllUsers().then((result) => {
      setAllUsers(result.data);
      setUserPermissions(result.data.map((item) => ({ ...item, updates: [] })));
    });
  }, []);

  useEffect(() => {
    console.log(
      userPermissions
        .filter((user) => user.updates.length > 0)
        .filter(
          (user) =>
            user.updates.filter((object) =>
              Object.values(object).includes("63a5ab91d0fa8fc87fe26f8e" && true)
            ).length > 0
        )
    );
  }, [userPermissions]);

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
        setCurrentUser(
          result.data.find((user) => user._id === currentUser._id)
        );
        setUserPermissions(
          result.data.map((item) => ({ ...item, updates: [] }))
        );
      });
    }
  }
  return (
    <div className={styles.clubCard}>
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
                    <AccordionSummary
                      sx={{
                        "&.MuiBadge-root": {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px !important",
                        },
                      }}
                      expandIcon={<ExpandMoreIcon />}
                      className={`${
                        userPermissions
                          .filter((user) => user.updates.length > 0)
                          .filter(
                            (user) =>
                              user.updates.filter(
                                (object) =>
                                  Object.values(object).includes(true) &&
                                  Object.values(object).includes(club.value)
                              ).length > 0
                          ).length > 0
                          ? styles.updateFlag
                          : ""
                      }`}
                    >
                      {/* <div className={`${styles.accordionHeader} `}> */}
                      <Badge
                        color="warning"
                        badgeContent={
                          allUsers.filter((user) =>
                            user.needWriteAccess.includes(club.value)
                          ).length
                        }
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <div className={styles.accordionClubName}>
                          {club.label}
                        </div>
                        {
                          <Collapse
                            in={
                              userPermissions
                                .filter((user) => user.updates.length > 0)
                                .filter(
                                  (user) =>
                                    user.updates.filter(
                                      (object) =>
                                        Object.values(object).includes(true) &&
                                        Object.values(object).includes(
                                          club.value
                                        )
                                    ).length > 0
                                ).length > 0
                            }
                          >
                            <Alert
                              size="small"
                              severity="info"
                              sx={{
                                "&.MuiPaper-root": {
                                  padding: "0px 5px !important",
                                },
                              }}
                            >
                              <strong>
                                Pending updates - Save to finalize!
                              </strong>
                            </Alert>
                          </Collapse>
                        }
                      </Badge>
                      {/* </div> */}
                    </AccordionSummary>
                    <AccordionDetails className={styles.accordionBody}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ padding: "0px 10px" }}>
                              Name
                            </TableCell>
                            <TableCell align="center">Rank</TableCell>
                            <TableCell align="center">Coach</TableCell>
                            <TableCell align="center">Calendar Edits</TableCell>
                            <TableCell align="center">Admin</TableCell>
                            <TableCell align="center">Access Request</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
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
                                        <TableCell
                                          align="center"
                                          key={index}
                                          permission={field}
                                          sx={{ padding: 0 }}
                                        >
                                          {
                                            <div
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
                                      }
                                      `}
                                            >
                                              <Checkbox
                                                className={styles.checkBox}
                                                checked={user[field].includes(
                                                  club.value
                                                )}
                                                onChange={(e) => {
                                                  handleUpdatePermissions(
                                                    e.currentTarget.closest(
                                                      "tr"
                                                    ).id,
                                                    e.currentTarget
                                                      .closest("tr")
                                                      .getAttribute("clubid"),
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
                                              ></Checkbox>
                                            </div>
                                          }
                                        </TableCell>
                                      );
                                    }
                                  );

                                  if (user.clubId.includes(club.value)) {
                                    return (
                                      <TableRow
                                        key={user._id}
                                        id={user._id}
                                        clubid={club.value}
                                        sx={{ padding: 0 }}
                                      >
                                        <TableCell sx={{ padding: "0px 10px" }}>
                                          {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          sx={{ padding: 0 }}
                                        >
                                          {user.belt}
                                        </TableCell>
                                        {userFields}
                                        <TableCell
                                          align="center"
                                          sx={{ padding: 0 }}
                                        >
                                          {user.needWriteAccess.includes(
                                            club.value
                                          ) ? (
                                            <Button
                                              size="sm"
                                              color="danger"
                                              variant="contained"
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
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }
                                })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            }
          })}

      <Collapse
        in={
          userPermissions
            .filter((user) => user.updates.length > 0)
            .filter(
              (user) =>
                user.updates.filter((object) =>
                  Object.values(object).includes(true)
                ).length > 0
            ).length > 0
        }
      >
        <div className={styles.buttons}>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              handleSubmitNewPermissions();
            }}
          >
            Save
          </Button>
          <Button
            color="danger"
            variant="contained"
            onClick={() => handleResetPermissions()}
          >
            Cancel
          </Button>
        </div>
      </Collapse>
    </div>
  );
}

export default PermissionsPanel;
