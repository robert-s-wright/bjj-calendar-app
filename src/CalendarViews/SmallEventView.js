import React, { useState } from "react";

import { durationCalculation } from "../utils";

import { Popover, Card, Divider, CardHeader, CardContent } from "@mui/material";

import { theme } from "../theme";

import styles from "./SmallEventView.module.css";

function SmallEventView({ event, date, monthView }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.target);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Card
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={(e) => handlePopoverOpen(e)}
        onMouseLeave={handlePopoverClose}
        key={event._id}
        sx={{
          "&.MuiPaper-root": {
            backgroundColor:
              event.clothing.length === 2
                ? theme.palette.success.main
                : event.clothing.includes("GI")
                ? theme.palette.gi.main
                : theme.palette.noGi.main,
            overflow: "hidden",
            whiteSpace: monthView ? "nowrap" : "normal",
            color: "white",
            fontWeight: "bold",
            fontSize: monthView ? "calc(5px + .5vw)" : "calc(10px + .6vw)",
          },
        }}
        className={styles.smallEvent}
      >
        {monthView ? (
          <>
            {`${date.getHours()}:${
              date.getMinutes() < 10
                ? date.getMinutes() + "0"
                : date.getMinutes()
            }`}{" "}
          </>
        ) : (
          <>
            <div>
              {`${date.getHours()}:${
                date.getMinutes() < 10
                  ? date.getMinutes() + "0"
                  : date.getMinutes()
              }`}
            </div>
          </>
        )}
        {event.openMat ? (
          "Open Mat"
        ) : (
          <>
            {event.level.length === 3
              ? "All Levels"
              : event.level.map((item) => item.substring(0, 3)).join(", ")}{" "}
            {event.group.length === 3 ? "All Ages" : event.group.join(", ")}
          </>
        )}
      </Card>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        disableRestoreFocus
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Card
          sx={{
            "&.MuiPaper-root": {
              maxWidth: "300px",
            },
          }}
        >
          <CardHeader
            className={styles.popoverHeader}
            subheader={
              event.openMat
                ? "Open Mat"
                : event.specialEvent
                ? "Special Event/Seminar"
                : "Standard Training Session"
            }
            title={`${date.getHours()}:${
              date.getMinutes() < 10
                ? date.getMinutes() + "0"
                : date.getMinutes()
            }`}
          />
          <Divider />
          <CardContent className={styles.popoverBody}>
            <div>
              <span className={styles.bold}>Agenda: </span>
              {event.schema.length > 0
                ? event.schema.map((item) => item).join(", ")
                : "No Agenda"}
            </div>
            <div>
              <span className={styles.bold}>Duration: </span>
              {durationCalculation(event.duration)}
            </div>
            <div>
              <span className={styles.bold}>Drilling/Sparring: </span>
              {`${100 - event.sparringTime}% / ${event.sparringTime}%`}
            </div>
            <div>
              <span className={styles.bold}>Coaches: </span>
              {event.coach.length > 0
                ? event.coach.join(", ")
                : // event.coach.map((item) => <span key={item}>{item}</span>)
                  "No Coaches Assigned"}
            </div>
            <div>
              <span className={styles.bold}>Clothing: </span>
              {event.clothing.join(", ")}
            </div>
            <div>
              <span className={styles.bold}>Levels: </span>
              {event.level.length === 3 ? "All Levels" : event.level.join(", ")}
            </div>
            <div>
              <span className={styles.bold}>Ages: </span>
              {event.group.length === 3 ? "All ages" : event.group.join(", ")}
            </div>
            <div>
              {event.notes !== "" ? (
                <>
                  <span className={styles.bold}>Notes: </span>

                  <span>{event.notes}</span>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
}

export default SmallEventView;
