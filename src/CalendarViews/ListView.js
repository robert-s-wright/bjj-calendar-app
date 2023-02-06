import React from "react";

import { durationCalculation } from "../utils";

import Card from "react-bootstrap/Card";

import styles from "./ListView.module.css";

function ListView({ userList, months, events, today }) {
  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.passTime).getFullYear() >= today.getFullYear() &&
      new Date(event.passTime).getMonth() >= today.getMonth() &&
      new Date(event.passTime).getDate() >= today.getDate()
  );

  if (upcomingEvents.length > 0) {
    return upcomingEvents.map((event, index) => {
      const date = new Date(event.passTime);

      return (
        <Card key={event._id}>
          <div className={styles.eventWrapper}>
            <Card
              key={event._id}
              className={`m-1 ${styles.eventCard}`}
            >
              <Card.Header
                style={{
                  backgroundColor: event.specialEvent ? "#ffc107" : "#144659",
                  color: event.specialEvent ? "black" : "white",
                }}
                className={` ${styles.eventHeader}`}
              >
                <h6 className="m-0">
                  {event.specialEvent
                    ? "Special Event/ Seminar"
                    : "Standard Training Session"}
                </h6>
                <div>
                  Added By:{" "}
                  {userList.map((item) => {
                    if (item._id === event.addedBy) {
                      return item.firstName;
                    }
                  })}
                </div>
              </Card.Header>
              <Card.Body className={` p-1 `}>
                <div className={` p-0 ${styles.eventCardBody}`}>
                  <div
                    bg="light"
                    className={styles.cardTime}
                  >
                    <h4>
                      {months[date.getMonth()]} {date.getDate()}{" "}
                      {date.getFullYear()}
                    </h4>
                    <h4 className="m-0">
                      {date.getHours()}:
                      {date.getMinutes() < 10
                        ? date.getMinutes() + "0"
                        : date.getMinutes()}
                    </h4>
                  </div>
                  <Card
                    bg="dark"
                    className={`px-2 my-1 ${styles.cardField}`}
                    text="white"
                  >
                    <div className={styles.cardFieldColumns}>
                      <div>
                        <div>
                          <bold>Agenda: </bold>
                          {event.schema.length > 0
                            ? event.schema.join(", ")
                            : "Agenda is empty"}
                        </div>
                        <div>
                          <bold>Duration: </bold>
                          {durationCalculation(event.duration)}
                        </div>

                        <div>
                          <bold>Drilling/Sparring: </bold>
                          {`${100 - event.sparringTime}/${event.sparringTime}`}
                        </div>

                        <div>
                          <bold>Coach: </bold>
                          {event.coach.length > 0
                            ? event.coach.join(" & ")
                            : "No coach assigned"}
                        </div>
                      </div>
                      <div>
                        <div>
                          <bold>Clothing: </bold>
                          {event.clothing.join(" / ")}
                        </div>
                        <div>
                          <bold>Levels: </bold>
                          {event.level.length === 3
                            ? "All Levels"
                            : event.level.join(", ")}
                        </div>

                        <div>
                          {" "}
                          <bold>Groups: </bold>
                          {event.group.length === 3
                            ? "All ages"
                            : event.group.join(", ")}
                        </div>
                      </div>
                    </div>
                    {event.notes.length > 0 ? (
                      <div>
                        <bold>Notes: </bold>
                        {event.notes}
                      </div>
                    ) : null}
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Card>
      );
    });
  } else {
    return <h3>No upcoming events!</h3>;
  }
}

export default ListView;
