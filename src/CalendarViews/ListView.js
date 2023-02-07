import React from "react";

import { durationCalculation } from "../utils";

import { Card } from "@mui/material";

import styles from "./ListView.module.css";

const ListView = React.forwardRef(
  ({ userList, months, events, today, transitionStyle }, viewRef) => {
    const upcomingEvents = events.filter(
      (event) =>
        new Date(event.passTime).getFullYear() >= today.getFullYear() &&
        new Date(event.passTime).getMonth() >= today.getMonth() &&
        new Date(event.passTime).getDate() >= today.getDate()
    );
    return (
      <div
        className={styles.container}
        style={{ ...transitionStyle }}
      >
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => {
            const date = new Date(event.passTime);

            return (
              <Card
                key={event._id}
                className={styles.eventContainer}
                sx={{ "&.MuiPaper-root": { padding: "0px !important" } }}
              >
                <div
                  style={{
                    backgroundColor: event.specialEvent ? "#ffc107" : "#144659",
                    color: event.specialEvent ? "black" : "white",
                  }}
                  className={` ${styles.eventHeader}`}
                >
                  <h3>
                    {event.specialEvent
                      ? "Special Event/ Seminar"
                      : "Standard Training Session"}
                  </h3>
                  <div>
                    Added By:{" "}
                    {userList.map((item) => {
                      if (item._id === event.addedBy) {
                        return item.firstName;
                      }
                    })}
                  </div>
                </div>
                <div>
                  <div className={styles.eventCardBody}>
                    <div className={styles.cardTime}>
                      <h4>
                        {months[date.getMonth()]} {date.getDate()}{" "}
                        {date.getFullYear()}
                      </h4>
                      <h4>
                        {date.getHours()}:
                        {date.getMinutes() < 10
                          ? date.getMinutes() + "0"
                          : date.getMinutes()}
                      </h4>
                    </div>
                    <div className={styles.cardField}>
                      <div className={styles.cardFieldColumns}>
                        <div>
                          <div>
                            <span className={styles.bold}>Agenda: </span>
                            {event.schema.length > 0
                              ? event.schema.join(", ")
                              : "Agenda is empty"}
                          </div>
                          <div>
                            <span className={styles.bold}>Duration: </span>
                            {durationCalculation(event.duration)}
                          </div>

                          <div>
                            <span className={styles.bold}>
                              Drilling/Sparring:{" "}
                            </span>
                            {`${100 - event.sparringTime}/${
                              event.sparringTime
                            }`}
                          </div>

                          <div>
                            <span className={styles.bold}>Coach: </span>
                            {event.coach.length > 0
                              ? event.coach.join(" & ")
                              : "No coach assigned"}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span className={styles.bold}>Clothing: </span>
                            {event.clothing.join(" / ")}
                          </div>
                          <div>
                            <span className={styles.bold}>Levels: </span>
                            {event.level.length === 3
                              ? "All Levels"
                              : event.level.length === 0
                              ? "None Selected"
                              : event.level.join(", ")}
                          </div>

                          <div>
                            <span className={styles.bold}>Groups: </span>
                            {event.group.length === 3
                              ? "All ages"
                              : event.group.length === 0
                              ? "None Selected"
                              : event.group.join(", ")}
                          </div>
                        </div>
                      </div>
                      {event.notes.length > 0 ? (
                        <div>
                          <span className={styles.bold}>Notes: </span>
                          {event.notes}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <h3>No upcoming events!</h3>
        )}
      </div>
    );
  }
);

export default ListView;
