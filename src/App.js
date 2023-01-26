import "./App.css";
import React from "react";
import { useState, useEffect } from "react";

import Spinner from "react-bootstrap/Spinner";

import Calendar from "./Calendar/Calendar";
import Login from "./Login/Login";
import AddClub from "./AddClub/AddClub";
import Registration from "./Registration/Registration";

import { authorizeUser, getClubs } from "./requests/requests";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addingClub, setAddingClub] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [clubList, setClubList] = useState([]);

  const verifyUser = async () => {
    const result = await authorizeUser();

    if (result.data.success === true) {
      setLoggedIn(true);
      setLoading(false);
      setCurrentUser((({ success, iat, ...object }) => object)(result.data));
    } else {
      setLoggedIn(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
    getClubs().then((data) => {
      setClubList(
        data.map((club) => ({ value: club._id, label: club.clubName }))
      );
    });
  }, []);

  return (
    <div className="App">
      {loading ? (
        <Spinner variant="light" />
      ) : addingClub ? (
        <AddClub setAddingClub={setAddingClub} />
      ) : loggedIn ? (
        <Calendar
          currentUser={currentUser}
          clubList={clubList}
          setLoggedIn={setLoggedIn}
          setLoading={setLoading}
        />
      ) : registering ? (
        <Registration
          setRegistering={setRegistering}
          clubList={clubList}
        />
      ) : (
        <Login
          setLoggedIn={setLoggedIn}
          setAddingClub={setAddingClub}
          setRegistering={setRegistering}
          verifyUser={verifyUser}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

export default App;
