import React, { useState, useEffect } from "react";

import SmallEventView from "./SmallEventView";
import DayHeader from "./DayHeader";

import {
  Button,
  Card,
  Popover,
  CardHeader,
  Divider,
  CardContent,
} from "@mui/material";

import { theme } from "../theme";

import { durationCalculation } from "../utils";

import styles from "./WeekView.module.css";

const WeekView = React.forwardRef(
  (
    {
      dayIsToday,
      displayModal,
      matchingEvents,
      selectedWeek,
      monthView,
      transitionStyle,
    },
    viewRef
  ) => {
    const [daysOfActiveWeek, setDaysOfActiveWeek] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    //compile days of the week
    function compileDaysOfWeek(month, year, day) {
      let days = [];

      const dayNumberInWeek = new Date(year, month, day).getDay();

      for (let i = 0; i < 7; i++) {
        days.push(new Date(year, month, day - dayNumberInWeek + i));
      }
      return days;
    }

    useEffect(() => {
      setDaysOfActiveWeek(
        compileDaysOfWeek(
          selectedWeek.getMonth(),
          selectedWeek.getFullYear(),
          selectedWeek.getDate()
        )
      );
    }, [selectedWeek]);

    //popover
    const handlePopoverOpen = (event, day) => {
      if (matchingEvents(day).length > 0) {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
      } else {
        return;
      }
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
      <div
        className={styles.weekView}
        style={{ ...transitionStyle }}
      >
        {daysOfActiveWeek.map((day, index) => {
          const activeMonth =
            day.getMonth() === selectedWeek.getMonth() &&
            day.getFullYear() === selectedWeek.getFullYear();

          return (
            <React.Fragment key={day.toString()}>
              <Button
                className={` p-0 ${styles.activeBtn} ${
                  activeMonth ? "" : styles.inactiveMonth
                }`}
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={(e) => handlePopoverOpen(e, day)}
                onMouseLeave={handlePopoverClose}
                color={dayIsToday(day) ? "primary" : "secondary"}
                variant="contained"
                onClick={(e) => displayModal(e)}
                value={day.toString()}
                id={day}
              >
                <DayHeader
                  day={day}
                  matchingEvents={matchingEvents}
                />

                {matchingEvents(day).length > 0 ? (
                  <div className={styles.eventsBadgeWeek}>
                    {matchingEvents(day).map((event, index) => {
                      const date = new Date(event.passTime);

                      return (
                        <SmallEventView
                          key={event._id}
                          event={event}
                          date={date}
                          monthView={monthView}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </Button>
              {anchorEl !== null &&
              anchorEl.id.toString() === day.toString() ? (
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
                  <div className={styles.popover}>
                    {matchingEvents(day).map((event) => {
                      const date = new Date(day);
                      return (
                        <Card
                          key={event._id}
                          sx={
                            {
                              // width: "250px",
                            }
                          }
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
                            subheaderTypographyProps={{
                              fontSize: ".9rem",
                              color: "white",
                            }}
                            title={`${date.getHours()}:${
                              date.getMinutes() < 10
                                ? date.getMinutes() + "0"
                                : date.getMinutes()
                            }`}
                            titleTypographyProps={{
                              fontSize: "1rem",
                              color: "white",
                            }}
                            sx={{
                              backgroundColor: !event.specialEvent
                                ? theme.palette.primary.main
                                : theme.palette.warning.main,
                              color: "white",
                              borderRadius: "5px",
                              padding: "10px",
                            }}
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
                              <span className={styles.bold}>
                                Drilling/Sparring:{" "}
                              </span>
                              {`${100 - event.sparringTime}% / ${
                                event.sparringTime
                              }%`}
                            </div>
                            <div>
                              <span className={styles.bold}>Coaches: </span>
                              {event.coach.length > 0
                                ? event.coach.join(", ")
                                : "No Coaches Assigned"}
                            </div>
                            <div>
                              <span className={styles.bold}>Clothing: </span>
                              {event.clothing.length > 0
                                ? event.clothing.join(", ")
                                : "Not defined"}
                            </div>
                            <div>
                              <span className={styles.bold}>Levels: </span>
                              {event.level.length === 3
                                ? "All Levels"
                                : event.level.length === 0
                                ? "No levels selected"
                                : event.level.join(", ")}
                            </div>
                            <div>
                              <span className={styles.bold}>Ages: </span>
                              {event.group.length === 3
                                ? "All ages"
                                : event.group.length === 0
                                ? "No ages selected"
                                : event.group.join(", ")}
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
                      );
                    })}
                  </div>
                </Popover>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

export default WeekView;
