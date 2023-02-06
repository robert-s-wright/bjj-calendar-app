import React, { useState, useEffect, useCallback } from "react";

import SmallEventView from "./SmallEventView";
import DayHeader from "./DayHeader";

import { Button, Card } from "@mui/material";

import styles from "./MonthView.module.css";

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

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

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
              <Button
                className={styles.activeBtn}
                variant="contained"
                color={dayIsToday(day) ? "primary" : "secondary"}
                onClick={(e) => displayModal(e)}
                value={day.toString()}
                key={day.toString()}
                sx={{
                  height: extraWeekInMonth ? "109px" : "130px",
                  transition: "height 200ms linear",
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
                      if (index < 4) {
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
                    {matchingEvents(day).length > 4 ? (
                      <Card
                        bg="dark"
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        className={styles.smallEvent}
                      >
                        + {matchingEvents(day).length - 4} more
                      </Card>
                    ) : null}
                  </div>
                ) : null}
              </Button>
            );
          }
        })}
      </div>
    );
  }
);

export default MonthView;
