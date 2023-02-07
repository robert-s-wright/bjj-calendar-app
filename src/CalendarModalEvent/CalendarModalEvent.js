import React from "react";

import {
  Card,
  Divider,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { durationCalculation } from "../utils";

import styles from "./CalendarModalEvent.module.css";

function CalendarModalEvent({
  element,
  userList,
  date,
  currentClub,
  currentUser,
  initiateEdit,
  handleDelete,
  addingEvent,
  editingEvent,
  newEventObject,
}) {
  return (
    <Card
      key={element._id}
      className={styles.eventCard}
    >
      <Accordion
        expanded={!addingEvent && !editingEvent}
        sx={{ padding: 0, margin: 0 }}
      >
        <AccordionSummary
          sx={{
            padding: 0,
            margin: 0,
            minHeight: "fit-content !important",
            ".MuiAccordionSummary-content": { margin: 0, height: "100%" },
            ".MuiAccordionSummary-content:hover": { cursor: "default" },
          }}
        >
          <div
            className={`${
              element.specialEvent ? styles.eventHeaderSpecial : ""
            } ${styles.eventHeader} 
            
             ${
               element._id === newEventObject._id
                 ? styles.eventHeaderEditing
                 : ""
             }`}
          >
            <div>
              {editingEvent || addingEvent ? (
                <>
                  {date.getHours()}:
                  {date.getMinutes() < 10
                    ? date.getMinutes() + "0 - "
                    : date.getMinutes() + " - "}
                </>
              ) : null}
              {element.specialEvent
                ? "Special Event / Seminar"
                : element.openMat
                ? "Open Mat"
                : "Standard Training Session"}
              {element._id === newEventObject._id ? " - Editing" : null}
            </div>
            <div>
              Added By:{" "}
              {userList.find((item) => item._id === element.addedBy) ===
              undefined
                ? "Former User"
                : userList.find((item) => item._id === element.addedBy)
                    .firstName}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.eventCardBody}>
            <div className={styles.cardTime}>
              {date.getHours()}:
              {date.getMinutes() < 10
                ? date.getMinutes() + "0"
                : date.getMinutes()}
            </div>
            <Divider
              orientation="vertical"
              flexItem
            />
            <div
              color="success"
              className={styles.cardField}
            >
              <div className={styles.cardColumns}>
                <div className={styles.rowOne}>
                  <div>
                    <span className={styles.bold}>Agenda: </span>
                    {element.schema.length > 0
                      ? element.schema.map((item, index) => {
                          if (
                            element.schema.length === 1 ||
                            element.schema.length === index + 1
                          ) {
                            return item;
                          } else {
                            return item + " & ";
                          }
                        })
                      : "Agenda is empty"}
                  </div>
                  <div>
                    <span className={styles.bold}>Duration: </span>
                    {durationCalculation(element.duration)}
                  </div>

                  <div>
                    <span className={styles.bold}>Drilling/Sparring: </span>
                    {`${100 - element.sparringTime}/${element.sparringTime}`}
                  </div>

                  <div>
                    <span className={styles.bold}>Coach: </span>
                    {element.coach.length > 0
                      ? element.coach.join(" & ")
                      : "No coach assigned"}
                  </div>
                </div>
                <div className={styles.rowTwo}>
                  <div>
                    <span className={styles.bold}>Clothing: </span>
                    {element.clothing.length === 0
                      ? "Not defined"
                      : element.clothing.join(" / ")}
                  </div>
                  <div>
                    <span className={styles.bold}>Levels: </span>
                    {element.level.length === 3
                      ? "All Levels"
                      : element.level.length === 0
                      ? "No levels selected"
                      : element.level.join(", ")}
                  </div>

                  <div>
                    {" "}
                    <span className={styles.bold}>Groups: </span>
                    {element.group.length === 3
                      ? "All ages"
                      : element.group.length === 0
                      ? "No ages selected"
                      : element.group.join(", ")}
                  </div>
                </div>
              </div>

              {element.notes.length > 0 ? (
                <div style={{ backgroundColor: "transparent" }}>
                  <span className={styles.bold}>Notes: </span>
                  {element.notes}
                </div>
              ) : null}
            </div>
            {currentUser.writeAccess.includes(currentClub.value) ? (
              editingEvent || addingEvent ? null : (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                  />
                  <div className={`${styles.listBtns}`}>
                    <>
                      <Tooltip
                        title="Edit Event"
                        disableInteractive
                        placement="left"
                        enterDelay={400}
                        leaveDelay={100}
                      >
                        <IconButton
                          variant="contained"
                          color="secondary"
                          size="small"
                          id={element._id}
                          onClick={(event) => {
                            initiateEdit(event.currentTarget.id);
                          }}
                        >
                          <EditIcon color="white"></EditIcon>
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Delete"
                        disableInteractive
                        placement="left"
                        enterDelay={400}
                        leaveDelay={100}
                      >
                        <IconButton
                          variant="contained"
                          color="error"
                          size="small"
                          id={element._id}
                          onClick={(e) => {
                            handleDelete(e.currentTarget.id);
                          }}
                        >
                          <DeleteForeverIcon></DeleteForeverIcon>
                        </IconButton>
                      </Tooltip>
                    </>
                  </div>
                </>
              )
            ) : null}
          </div>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

export default CalendarModalEvent;
