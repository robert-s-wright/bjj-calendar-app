import React, { useState, useEffect } from "react";

import SmallEventView from "./SmallEventView";
import DayHeader from "./DayHeader";

import { Button, Card } from "@mui/material";

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
            <Button
              key={index}
              className={` p-0 ${styles.activeBtn} ${
                activeMonth ? "" : styles.inactiveMonth
              }`}
              color={dayIsToday(day) ? "primary" : "secondary"}
              variant="contained"
              onClick={(e) => displayModal(e)}
              value={day.toString()}
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
          );
        })}
      </div>
    );
  }
);

export default WeekView;
