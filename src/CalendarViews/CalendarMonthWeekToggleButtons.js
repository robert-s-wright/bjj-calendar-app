import React from "react";

import { Button } from "@mui/material";

import styles from "./CalendarMonthWeekToggleButtons.module.css";

const CalendarMonthWeekToggleButtons = React.forwardRef(
  (
    { monthView, changeMonth, setMonthView, changeWeek, transitionStyle },
    viewRef
  ) => {
    return (
      <>
        {monthView ? (
          <div
            className={styles.changeMonth}
            style={{ ...transitionStyle }}
          >
            <Button
              className={styles.monthSelector}
              onClick={(e) => changeMonth(e)}
              variant="contained"
              color="secondary"
              value="prev"
            >
              Previous Month
            </Button>
            <Button
              className={`${styles.viewSelector} ${styles.toggle}`}
              onClick={() => setMonthView((state) => !state)}
              variant="contained"
              color="primary"
            >
              {monthView ? "Week" : "Month"} View
            </Button>
            <Button
              className={styles.monthSelector}
              onClick={(e) => changeMonth(e)}
              color="secondary"
              variant="contained"
              value="next"
            >
              Next Month
            </Button>
          </div>
        ) : (
          <div
            className={styles.changeWeek}
            style={{ ...transitionStyle }}
          >
            <Button
              className={styles.monthSelector}
              onClick={(e) => changeWeek(e)}
              color="secondary"
              variant="contained"
              value="prev"
            >
              Previous Week
            </Button>
            <Button
              className={`${styles.viewSelector} ${styles.toggle}`}
              onClick={() => setMonthView((state) => !state)}
              color="primary"
              variant="contained"
            >
              {monthView ? "Week" : "Month"} View
            </Button>
            <Button
              className={styles.monthSelector}
              onClick={(e) => changeWeek(e)}
              color="secondary"
              variant="contained"
              value="next"
            >
              Next Week
            </Button>
          </div>
        )}
      </>
    );
  }
);

export default CalendarMonthWeekToggleButtons;
