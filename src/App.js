import "./App.css";
import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";

import { Transition } from "react-transition-group";

import { theme } from "./theme";

import { ThemeProvider, CircularProgress } from "@mui/material";

import Calendar from "./Calendar/Calendar";
import Login from "./Login/Login";
import AddClub from "./AddClub/AddClub";
import Registration from "./Registration/Registration";

import { authorizeUser, getClubs } from "./requests/requests";

import {
  transitionStyles,
  defaultStyle,
  transitionDuration,
} from "./transitionStyles";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addingClub, setAddingClub] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [clubList, setClubList] = useState([]);

  const nodeRef = useRef(null);

  const verifyUser = async () => {
    const result = await authorizeUser();

    if (result.data.success === true) {
      setLoggedIn(true);
      setLoading(false);
      setCurrentUser((({ success, iat, ...object }) => object)(result.data));
    } else {
      setLoggedIn(false);
      setLoading(false);
      setLoggingIn(true);
    }
  };

  useEffect(() => {
    getClubs().then((data) => {
      setClubList(
        data.map((club) => ({ value: club._id, label: club.clubName }))
      );
    });
    verifyUser();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Transition
          in={loading}
          timeout={transitionDuration}
          nodeRef={nodeRef}
          mountOnEnter
          unmountOnExit
          appear
        >
          {(state) => (
            <CircularProgress
              color="light"
              style={{
                position: "absolute",
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              ref={nodeRef}
            />
          )}
        </Transition>
        <Transition
          in={addingClub}
          nodeRef={nodeRef}
          timeout={transitionDuration}
          mountOnEnter
          unmountOnExit
          appear
        >
          {(state) => (
            <AddClub
              setAddingClub={setAddingClub}
              setLoggingIn={setLoggingIn}
              nodeRef={nodeRef}
              transitionStyle={{ ...defaultStyle, ...transitionStyles[state] }}
            />
          )}
        </Transition>
        <Transition
          in={loggedIn}
          timeout={transitionDuration}
          nodeRef={nodeRef}
          mountOnEnter
          unmountOnExit
          appear
        >
          {(state) => (
            <Calendar
              currentUser={currentUser}
              clubList={clubList}
              setLoggedIn={setLoggedIn}
              setLoggingIn={setLoggingIn}
              setLoading={setLoading}
              setCurrentUser={setCurrentUser}
              theme={theme}
              nodeRef={nodeRef}
              transitionStyle={{ ...defaultStyle, ...transitionStyles[state] }}
            />
          )}
        </Transition>
        <Transition
          in={registering}
          nodeRef={nodeRef}
          timeout={transitionDuration}
          mountOnEnter
          unmountOnExit
          appear
        >
          {(state) => (
            <Registration
              setRegistering={setRegistering}
              setLoggingIn={setLoggingIn}
              clubList={clubList}
              nodeRef={nodeRef}
              transitionStyle={{ ...defaultStyle, ...transitionStyles[state] }}
            />
          )}
        </Transition>
        <Transition
          in={loggingIn}
          timeout={transitionDuration}
          nodeRef={nodeRef}
          mountOnEnter
          unmountOnExit
          appear
        >
          {(state) => (
            <Login
              setLoggedIn={setLoggedIn}
              setAddingClub={setAddingClub}
              setRegistering={setRegistering}
              verifyUser={verifyUser}
              setLoading={setLoading}
              setLoggingIn={setLoggingIn}
              nodeRef={nodeRef}
              transitionStyle={{ ...defaultStyle, ...transitionStyles[state] }}
            />
          )}
        </Transition>
      </ThemeProvider>
    </div>
  );
}

export default App;

export { defaultStyle, transitionStyles };
