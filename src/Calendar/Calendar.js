import React from "react";
import { useState, useEffect } from "react";

import {
  fetchEvents,
  logoutUser,
  fetchUsers,
  fetchClub,
} from "../requests/requests";

import CalendarModal from "../CalendarModal/CalendarModal";
import ControlPanel from "../ControlPanel/ControlPanel";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";

import { Typeahead } from "react-bootstrap-typeahead";
import Select from "react-select";

import { Star, GearFill } from "react-bootstrap-icons/";

import styles from "./Calendar.module.css";

function Calendar(props) {
  const { currentUser, clubList, setLoggedIn, setLoading } = props;

  const today = new Date();

  const [selectedWeek, setSelectedWeek] = useState(today);
  const [monthView, setMonthView] = useState(true);
  const [listView, setListView] = useState(false);
  const [daysOfActiveMonth, setDaysOfActiveMonth] = useState([]);
  const [daysOfActiveWeek, setDaysOfActiveWeek] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentClub, setCurrentClub] = useState(
    clubList.find((club) => club.value === currentUser.defaultClub)
  );
  const [events, setEvents] = useState([]);
  const [userList, setUserList] = useState([]);

  const [controlPanelOpen, setControlPanelOpen] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  //fetch events
  const callEvents = async (id) => {
    const result = await fetchEvents("events", id);

    result.data.sort(
      (a, b) => new Date(a.passTime).getTime() - new Date(b.passTime).getTime()
    );

    setEvents(result.data);
  };

  //fetch users
  const callUsers = async () => {
    const result = await fetchUsers(currentClub.value);
    setUserList(result.data);
  };

  useEffect(() => {
    console.log(currentUser);
    setCurrentClub(
      clubList.find((club) => club.value === currentUser.defaultClub)
    );
  }, [currentUser]);

  useEffect(() => {
    callUsers();

    currentClub !== undefined && callEvents(currentClub.value);
  }, [currentClub]);

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

  //compile days of the week
  function compileDaysOfWeek(month, year, day) {
    let days = [];

    const dayNumberInWeek = new Date(year, month, day).getDay();

    for (let i = 0; i < 7; i++) {
      days.push(new Date(year, month, day - dayNumberInWeek + i));
    }
    return days;
  }

  // update active months and weeks upon change
  useEffect(() => {
    setDaysOfActiveMonth(
      compileCalendar(selectedWeek.getMonth(), selectedWeek.getFullYear())
    );
  }, [selectedWeek]);

  useEffect(() => {
    setDaysOfActiveWeek(
      compileDaysOfWeek(
        selectedWeek.getMonth(),
        selectedWeek.getFullYear(),
        selectedWeek.getDate()
      )
    );
  }, [selectedWeek]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) =>
  //     console.log("Latitude is :", position.coords.latitude)
  //   );
  // });

  //duration calculation
  function durationCalculation(value) {
    let hour = 0;
    let minutes = value;

    while (minutes >= 60) {
      hour += 1;
      minutes -= 60;
    }

    return `${hour}:${minutes === 0 ? "00" : minutes}`;
  }

  //construct matching events
  function matchingEvents(day) {
    return events.filter((element) => {
      const date = new Date(element.passTime);
      return (
        date.getDate() === day.getDate() &&
        date.getMonth() === day.getMonth() &&
        date.getYear() === day.getYear()
      );
    });
  }

  //day is today function
  function dayIsToday(day) {
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }

  //construct day header element
  function dayHeader(day, matchingEvents) {
    return (
      <div className={styles.dayHeader}>
        <Badge
          pill
          bg="dark"
          className="mt-1 mx-1"
        >
          {day.getDate()}
        </Badge>
        {matchingEvents.some((element) => element.specialEvent === true) ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Special Event/Seminar</Tooltip>}
          >
            <Star className="mt-1 mx-1" />
          </OverlayTrigger>
        ) : null}
      </div>
    );
  }

  //small event view on calendar
  function smallEventView(event, date, index) {
    return (
      <OverlayTrigger
        placement="auto"
        key={index}
        overlay={
          <Popover>
            <Popover.Header>
              {`${date.getHours()}:${
                date.getMinutes() < 10
                  ? date.getMinutes() + "0"
                  : date.getMinutes()
              }`}
              {event.openMat
                ? " - Open Mat"
                : event.specialEvent
                ? " - Special Event/Seminar"
                : " - Standard Training Session"}
            </Popover.Header>
            <Popover.Body>
              <div>
                <span className={styles.bold}>Agenda: </span>
                {event.schema.length > 0
                  ? event.schema.map((item) => item)
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
                  ? event.coach.map((item) => (
                      <span key={item._id}>{item.label}</span>
                    ))
                  : "No Coaches Assigned"}
              </div>
              <div>
                <span className={styles.bold}>Clothing: </span>
                {event.clothing.join(", ")}
              </div>
              <div>
                <span className={styles.bold}>Levels: </span>
                {event.level.length === 3
                  ? "All Levels"
                  : event.level.join(", ")}
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
            </Popover.Body>
          </Popover>
        }
      >
        <Card
          key={index}
          bg={
            event.clothing.length === 2
              ? "success"
              : event.clothing.includes("GI")
              ? "gi"
              : "noGi"
          }
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          className={styles.smallEvent}
        >
          <span>
            {`${date.getHours()}:${
              date.getMinutes() < 10
                ? date.getMinutes() + "0"
                : date.getMinutes()
            }`}{" "}
            {event.openMat ? (
              "Open Mat"
            ) : (
              <>
                {event.level.length === 3
                  ? "All Levels"
                  : event.level
                      .map((item) => item.substring(0, 3))
                      .join(", ")}{" "}
                {event.group.length === 3 ? "All Ages" : event.group.join(", ")}
              </>
            )}
          </span>
        </Card>
      </OverlayTrigger>
    );
  }

  //create month calendar view
  const monthCalendarView = daysOfActiveMonth.map((day, index) => {
    if (!day) {
      return (
        <div
          className={styles.inactiveMonth}
          key={index}
        ></div>
      );
    } else {
      return (
        <Button
          className={styles.activeBtn}
          variant={dayIsToday(day) ? "primary" : "secondary"}
          onClick={(e) => displayModal(e)}
          value={day.toString()}
          key={index}
        >
          {dayHeader(day, matchingEvents(day))}

          {matchingEvents(day).length > 0 ? (
            <div className={styles.eventsBadgeMonth}>
              {matchingEvents(day).map((event, index) => {
                const date = new Date(event.passTime);
                if (index < 4) {
                  return smallEventView(event, date, index);
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
  });

  //create week calendar view
  const weekCalendarView = daysOfActiveWeek.map((day, index) => {
    const activeMonth =
      day.getMonth() === selectedWeek.getMonth() &&
      day.getFullYear() === selectedWeek.getFullYear();

    return (
      <Button
        key={index}
        className={` p-0 ${styles.activeBtn} ${
          activeMonth ? "" : styles.inactiveMonth
        }`}
        variant={dayIsToday(day) ? "primary" : "secondary"}
        onClick={(e) => displayModal(e)}
        value={day.toString()}
      >
        {dayHeader(day, matchingEvents(day))}

        {matchingEvents(day).length > 0 ? (
          <div className={styles.eventsBadgeWeek}>
            {matchingEvents(day).map((event, index) => {
              const date = new Date(event.passTime);

              return smallEventView(event, date, index);
            })}
          </div>
        ) : null}
      </Button>
    );
  });

  //create list view
  function listCalendarView() {
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
                              ? event.schema.map((item, index) => {
                                  if (
                                    event.schema.length === 1 ||
                                    event.schema.length === index + 1
                                  ) {
                                    return item;
                                  } else {
                                    return item + " & ";
                                  }
                                })
                              : "Agenda is empty"}
                          </div>
                          <div>
                            <bold>Duration: </bold>
                            {durationCalculation(event.duration)}
                          </div>

                          <div>
                            <bold>Drilling/Sparring: </bold>
                            {`${100 - event.sparringTime}/${
                              event.sparringTime
                            }`}
                          </div>

                          <div>
                            <bold>Coach: </bold>
                            {event.coach.length > 0
                              ? event.coach.map((item, index) => {
                                  if (
                                    event.coach.length === 1 ||
                                    event.coach.length === index + 1
                                  ) {
                                    return item.label;
                                  } else {
                                    return item.label + " & ";
                                  }
                                })
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

  //log out
  async function logOut() {
    setLoading(true);
    await logoutUser();
    setLoggedIn(false);
    setLoading(false);
  }

  function changeMonth(e) {
    if (e.target.value === "next") {
      setSelectedWeek(
        new Date(selectedWeek.getFullYear(), selectedWeek.getMonth() + 1, 1)
      );
    } else {
      setSelectedWeek(
        new Date(selectedWeek.getFullYear(), selectedWeek.getMonth() - 1, 1)
      );
    }
  }

  function changeWeek(e) {
    if (e.target.value === "next") {
      setSelectedWeek(
        new Date(
          selectedWeek.getFullYear(),
          selectedWeek.getMonth(),
          selectedWeek.getDate() + 7
        )
      );
    } else {
      setSelectedWeek(
        new Date(
          selectedWeek.getFullYear(),
          selectedWeek.getMonth(),
          selectedWeek.getDate() - 7
        )
      );
    }
  }

  //calculate week number
  const weekNumber =
    Math.floor(
      (selectedWeek.getTime() / 86400000 -
        new Date(selectedWeek.getFullYear(), 0, 1).getTime() / 86400000) /
        7
    ) + 1;

  //show modal
  function displayModal(e) {
    if (modalVisibility === false) {
      setModalVisibility(true);
      setSelectedDate(new Date(e.currentTarget.value));
    } else {
      setModalVisibility(false);
      setTimeout(() => {
        setSelectedDate(today);
      }, 500);
    }
  }

  return (
    <div>
      <Card className={`m-3 ${styles.wrapper}`}>
        <div
          className={`m-2 ${styles.header}`}
          bg="secondary"
        >
          <div className={styles.userInfo}>
            <Badge>{`${currentUser.firstName} ${currentUser.lastName}`}</Badge>
            <br />

            <div className={styles.legend}>
              <div>
                <Badge bg="gi"> GI </Badge>
              </div>
              <div>
                <Badge bg="noGi">No GI</Badge>
              </div>
              <div>
                <Badge bg="success">Both</Badge>
              </div>
            </div>
          </div>
          <div className={styles.title}>
            <Select
              id="currentClub"
              isMulti={false}
              defaultValue={[currentClub]}
              options={clubList}
              onChange={(e) => {
                setCurrentClub(e);
                // callEvents(e.value);
              }}
              className={styles.clubSelector}
            ></Select>
            {listView ? null : (
              <>
                <h3>
                  {`${
                    months[selectedWeek.getMonth()]
                  } ${selectedWeek.getFullYear()}`}
                </h3>
                {!monthView ? <h5>Week Number: {weekNumber}</h5> : null}
              </>
            )}
          </div>
          <div>
            <div className={styles.headerButtons}>
              <h3>
                <GearFill
                  className={styles.preferences}
                  onClick={() => setControlPanelOpen((state) => !state)}
                />
              </h3>
              <Badge bg="secondary">
                <div className={styles.toggleView}>
                  <div>Calendar</div>
                  <div className={styles.viewSlider}>
                    <div
                      className={`${styles.sliderButton}  ${
                        listView ? styles.right : styles.left
                      }`}
                      onClick={() => setListView((state) => !state)}
                    ></div>
                  </div>
                  <div>List</div>
                </div>
              </Badge>
              <Button onClick={(e) => logOut()}>Log Out</Button>
            </div>
          </div>
        </div>
        {!listView ? (
          <>
            <div className={styles.weekdayHeading}>
              <Badge>Sunday</Badge>
              <Badge>Monday</Badge>
              <Badge>Tuesday</Badge>
              <Badge>Wednesday</Badge>
              <Badge>Thursday</Badge>
              <Badge>Friday</Badge>
              <Badge>Saturday</Badge>
            </div>
            {monthView ? (
              <div className={styles.monthView}>{monthCalendarView}</div>
            ) : (
              <div className={styles.weekView}>{weekCalendarView}</div>
            )}
            {monthView ? (
              <div className={styles.changeMonth}>
                <Button
                  className={styles.monthSelector}
                  onClick={(e) => changeMonth(e)}
                  variant="secondary"
                  value="prev"
                  style={{ color: "white" }}
                >
                  Previous Month
                </Button>
                <Button
                  className={`m-2 ${styles.viewSelector} ${styles.toggle}`}
                  onClick={() => setMonthView((state) => !state)}
                  variant="primary"
                  style={{ width: "fit-content" }}
                >
                  {monthView ? "Week" : "Month"} View
                </Button>
                <Button
                  className={styles.monthSelector}
                  onClick={(e) => changeMonth(e)}
                  variant="secondary"
                  value="next"
                  style={{ color: "white" }}
                >
                  Next Month
                </Button>
              </div>
            ) : (
              <div className={styles.changeWeek}>
                <Button
                  className={styles.monthSelector}
                  onClick={(e) => changeWeek(e)}
                  variant="secondary"
                  value="prev"
                  style={{ color: "white" }}
                >
                  Previous Week
                </Button>
                <Button
                  className={`m-2 ${styles.viewSelector} ${styles.toggle}`}
                  onClick={() => setMonthView((state) => !state)}
                  variant="primary"
                  style={{ width: "fit-content" }}
                >
                  {monthView ? "Week" : "Month"} View
                </Button>
                <Button
                  className={styles.monthSelector}
                  onClick={(e) => changeWeek(e)}
                  variant="secondary"
                  value="next"
                  style={{ color: "white" }}
                >
                  Next Week
                </Button>
              </div>
            )}
          </>
        ) : (
          <div>{listCalendarView()}</div>
        )}
      </Card>

      {modalVisibility ? (
        <CalendarModal
          props={{
            modalVisibility,
            selectedDate,
            events,
            displayModal,
            weekdays,
            months,
            setEvents,
            callEvents,
            currentUser,
            userList,
            durationCalculation,
            currentClub,
          }}
        />
      ) : null}
      {controlPanelOpen ? (
        <ControlPanel
          props={{
            controlPanelOpen,
            currentUser,
            setControlPanelOpen,
            userList,
            setUserList,
            clubList,
          }}
        />
      ) : null}
    </div>
  );
}

export default Calendar;
