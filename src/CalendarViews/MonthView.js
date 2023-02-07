import React, { useState, useEffect, useCallback } from "react";

import SmallEventView from "./SmallEventView";
import DayHeader from "./DayHeader";

import {
  Button,
  Popover,
  Card,
  CardHeader,
  Divider,
  CardContent,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";

import { durationCalculation } from "../utils";

import styles from "./MonthView.module.css";
import { theme } from "../theme";

const MonthView = React.forwardRef(
  (
    {
      selectedWeek,
      dayIsToday,
      displayModal,
      matchingEvents,
      monthView,
      transitionStyle,
    },
    viewRef
  ) => {
    const [daysOfActiveMonth, setDaysOfActiveMonth] = useState([]);
    const [extraWeekInMonth, setExtraWeekInMonth] = useState();
    const [anchorEl, setAnchorEl] = useState(null);

    //determine if month has more than 5 instances of one day
    const dayCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const firstDayOfMonthWeekday = useCallback(() => {
      return new Date(
        selectedWeek.getFullYear(),
        selectedWeek.getMonth(),
        1
      ).getDay();
    }, [selectedWeek]);

    useEffect(() => {
      if (daysOfActiveMonth.length > 0) {
        daysOfActiveMonth.forEach((day) => {
          if (day !== undefined) {
            dayCount[day.getDay()] = dayCount[day.getDay()] + 1;
          }
        });
      }

      setExtraWeekInMonth(firstDayOfMonthWeekday() !== 0 && dayCount[0] === 5);
    }, [daysOfActiveMonth]);

    //compile the active month calendar
    function compileCalendar(month, year) {
      let days = [];
      const firstDayOfMonthWeekday = new Date(year, month, 1).getDay();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

      for (
        let i = 1 - firstDayOfMonthWeekday;
        i < 38 - firstDayOfMonthWeekday;
        i++
      ) {
        const currentDay = new Date(year, month, i);
        if (i <= 0 || i > lastDayOfMonth) {
          days.push(undefined);
        } else {
          days.push(new Date(currentDay + i));
        }
      }
      return days;
    }

    useEffect(() => {
      setDaysOfActiveMonth(
        compileCalendar(selectedWeek.getMonth(), selectedWeek.getFullYear())
      );
    }, [selectedWeek]);

    const handlePopoverOpen = (event, day) => {
      if (matchingEvents(day).length > 0) {
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
        className={styles.monthView}
        style={{ ...transitionStyle }}
      >
        {daysOfActiveMonth.map((day, index) => {
          if (!day) {
            return (
              <div
                key={index}
                className={styles.inactiveMonth}
              ></div>
            );
          } else {
            return (
              <React.Fragment key={day.toString()}>
                <Button
                  className={styles.activeBtn}
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => handlePopoverOpen(e, day)}
                  onMouseLeave={handlePopoverClose}
                  variant="contained"
                  color={dayIsToday(day) ? "primary" : "secondary"}
                  onClick={(e) => displayModal(e)}
                  value={day.toString()}
                  // key={day.toString()}
                  id={day}
                  sx={{
                    height: extraWeekInMonth ? "109px" : "130px",
                    transition: "height 150ms ease-in-out",
                  }}
                >
                  <DayHeader
                    matchingEvents={matchingEvents}
                    day={day}
                  />

                  {matchingEvents(day).length > 0 ? (
                    <div className={styles.eventsBadgeMonth}>
                      {matchingEvents(day).map((event, index) => {
                        const date = new Date(event.passTime);
                        if (index < 3) {
                          return (
                            <>
                              <SmallEventView
                                key={event._id}
                                event={event}
                                date={date}
                                monthView={monthView}
                              />
                            </>
                          );
                        }
                      })}
                      {matchingEvents(day).length > 3 ? (
                        <div
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                          className={styles.smallEvent}
                        >
                          + {matchingEvents(day).length - 3} more
                        </div>
                      ) : null}
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
                    {}
                    <div className={styles.popover}>
                      {matchingEvents(day).map((event) => {
                        const date = new Date(day);
                        return (
                          <Card key={event._id}>
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
          }
        })}
      </div>
    );
  }
);

export default MonthView;
