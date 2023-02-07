import React, { useState, useEffect, useCallback, useRef } from "react";

import { fetchEvents, logoutUser, fetchUsers } from "../requests/requests";

import CalendarModal from "../CalendarModal/CalendarModal";
import ControlPanel from "../ControlPanel/ControlPanel";
import MonthView from "./../CalendarViews/MonthView";
import WeekView from "../CalendarViews/WeekView";
import ListView from "../CalendarViews/ListView";

import SettingsIcon from "@mui/icons-material/Settings";

import {
  Autocomplete,
  TextField,
  Button,
  Card,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { Transition } from "react-transition-group";

import {
  transitionStyles,
  defaultStyle,
  transitionDuration,
} from "./../transitionStyles";

import styles from "./Calendar.module.css";
import CalendarMonthWeekToggleButtons from "../CalendarViews/CalendarMonthWeekToggleButtons";

const Calendar = React.forwardRef((props, nodeRef) => {
  const {
    currentUser,
    clubList,
    setLoggedIn,
    setLoggingIn,
    setLoading,
    setCurrentUser,
    theme,
    transitionStyle,
  } = props;

  const today = new Date();

  const [selectedWeek, setSelectedWeek] = useState(today);
  const [monthView, setMonthView] = useState(true);
  const [listView, setListView] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentClub, setCurrentClub] = useState({});
  const [events, setEvents] = useState([]);
  const [userList, setUserList] = useState([]);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);

  const viewRef = useRef(null);

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
    setCurrentClub(
      clubList.find((club) => club.value === currentUser.defaultClub)
    );
  }, [clubList]);

  useEffect(() => {
    callUsers();
    callEvents(currentClub.value);
  }, [currentClub]);

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
  const dayIsToday = (day) => {
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

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

  const changeWeek = useCallback(
    (e) => {
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
    },
    [selectedWeek]
  );

  //calculate week number
  const weekNumber =
    Math.floor(
      (selectedWeek.getTime() / 86400000 -
        new Date(selectedWeek.getFullYear(), 0, 1).getTime() / 86400000) /
        7
    ) + 1;

  //show modal
  const displayModal = (e) => {
    if (modalVisibility === false) {
      setSelectedDate(new Date(e.currentTarget.value));
      setModalVisibility(true);
    } else {
      setModalVisibility(false);
      setSelectedDate(today);
    }
  };

  const toggleControlPanel = () => {
    setControlPanelOpen((state) => !state);
  };

  return (
    <Card
      className={` ${styles.wrapper}`}
      style={{ ...transitionStyle }}
    >
      <div
        className={` ${styles.header}`}
        bg="secondary"
      >
        <div className={styles.userInfo}>
          <Card
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              padding: "0px 5px",
            }}
          >{`${currentUser.firstName} ${currentUser.lastName}`}</Card>

          <div className={styles.legend}>
            <div>
              <Card
                sx={{
                  backgroundColor: theme.palette.gi.main,
                  color: "white",
                  padding: "0px 5px",
                }}
              >
                GI
              </Card>
            </div>
            <div>
              <Card
                bg="noGi"
                sx={{
                  backgroundColor: theme.palette.noGi.main,
                  color: "white",
                  padding: "0px 5px",
                }}
              >
                <div>No GI</div>
              </Card>
            </div>
            <div>
              <Card
                sx={{
                  backgroundColor: theme.palette.success.main,
                  color: "white",
                  padding: "0px 5px",
                }}
              >
                Both
              </Card>
            </div>
          </div>
        </div>
        <div className={styles.title}>
          {listView ? null : (
            <div>
              {`${
                months[selectedWeek.getMonth()]
              } ${selectedWeek.getFullYear()} ${
                !monthView ? "Week " + weekNumber : ""
              }`}
            </div>
          )}
          {currentClub !== {} ? (
            <Autocomplete
              clearIcon={false}
              id="currentClub"
              value={currentClub}
              options={clubList}
              getOptionLabel={(option) =>
                option.label !== undefined ? option.label : ""
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === undefined
              }
              onChange={(e, value) => {
                if (value !== null) {
                  setCurrentClub(value);
                } else {
                  return;
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  margin="none"
                />
              )}
            ></Autocomplete>
          ) : null}
        </div>
        <div>
          <div className={styles.headerButtons}>
            <div>
              <FormControlLabel
                label="List View"
                control={
                  <Switch
                    checked={listView}
                    onChange={(e, checked) => setListView(checked)}
                    color="default"
                  />
                }
              />

              <IconButton onClick={() => toggleControlPanel()}>
                <SettingsIcon />
              </IconButton>
            </div>

            <Button
              variant="contained"
              onClick={() => {
                logOut();
                setLoggingIn(true);
              }}
              sx={{ height: "fit-content" }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <Transition
        in={!listView}
        timeout={transitionDuration}
        nodeRef={viewRef}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <div
            className={styles.weekdayHeading}
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {weekdays.map((day) => (
              <Card
                key={day}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                {day}
              </Card>
            ))}
          </div>
        )}
      </Transition>

      <div className={styles.viewContainer}>
        <Transition
          in={monthView && !listView}
          timeout={transitionDuration}
          nodeRef={viewRef}
          mountOnEnter
          unmountOnExit
          // appear
        >
          {(state) => (
            <MonthView
              selectedWeek={selectedWeek}
              dayIsToday={dayIsToday}
              displayModal={displayModal}
              matchingEvents={matchingEvents}
              monthView={monthView}
              viewRef={nodeRef}
              transitionStyle={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
            />
          )}
        </Transition>

        <Transition
          in={!monthView && !listView}
          timeout={transitionDuration}
          nodeRef={viewRef}
          mountOnEnter
          unmountOnExit
          // appear
        >
          {(state) => (
            <WeekView
              dayIsToday={dayIsToday}
              displayModal={displayModal}
              matchingEvents={matchingEvents}
              selectedWeek={selectedWeek}
              monthView={monthView}
              viewRef={nodeRef}
              transitionStyle={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
            />
          )}
        </Transition>
        <Transition
          in={listView}
          timeout={transitionDuration}
          nodeRef={viewRef}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <ListView
              userList={userList}
              months={months}
              events={events}
              today={today}
              viewRef={nodeRef}
              transitionStyle={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
            />
          )}
        </Transition>
      </div>

      <Transition
        in={!listView}
        timeout={transitionDuration}
        nodeRef={viewRef}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <CalendarMonthWeekToggleButtons
            monthView={monthView}
            changeMonth={changeMonth}
            setMonthView={setMonthView}
            changeWeek={changeWeek}
            viewRef={nodeRef}
            transitionStyle={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          />
        )}
      </Transition>

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
          currentClub,
        }}
      />
      <ControlPanel
        props={{
          controlPanelOpen,
          currentUser,
          setControlPanelOpen,
          userList,
          setUserList,
          clubList,
          setCurrentUser,
        }}
      />
    </Card>
  );
});

export default Calendar;
