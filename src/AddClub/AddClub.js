import React from "react";
import { useEffect, useState } from "react";

import { getCountries, getAffiliations, postClub } from "../requests/requests";

import { TextField, Autocomplete, Card, Button, Alert } from "@mui/material";

import styles from "./AddClub.module.css";

function AddClub(props, nodeRef) {
  const { setAddingClub, transitionStyle, setLoggingIn } = props;

  const blankClub = {
    clubName: null,
    affiliation: null,
    address: null,
    city: null,
    zip: null,
    country: null,
    contact: null,
    email: null,
    phone: null,
    website: null,
  };

  const [newClub, setNewClub] = useState(blankClub);

  const [countries, setCountries] = useState([]);

  const [affiliationList, setAffiliationList] = useState([]);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [registerSuccess, setRegisterSuccess] = useState(undefined);

  const [formErrors, setFormErrors] = useState({
    clubName: true,
    affiliation: true,
    address: true,
    city: true,
    zip: true,
    country: true,
    contact: true,
    email: true,
    phone: true,
    website: true,
  });

  useEffect(() => {
    getCountries().then((data) => {
      const sortedData = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(
        sortedData.map((country) => ({
          value: country.cca2,
          label: country.name.common,
        }))
      );
    });

    getAffiliations().then((data) => {
      setAffiliationList(
        data.data.map((affiliation) => ({
          value: affiliation._id,
          label: affiliation.name,
        }))
      );
    });
  }, []);

  const handleRegister = async (newClub) => {
    setAttemptedSubmit(true);

    if (Object.values(formErrors).includes(true)) {
      return;
    } else {
      const result = await postClub(newClub);
      if (result.data) {
        setRegisterSuccess(true);
      } else {
        setRegisterSuccess(false);
      }
    }
    setTimeout(() => {
      setRegisterSuccess(undefined);
    }, 3000);
  };

  return (
    <Card
      className={styles.card}
      style={{ ...transitionStyle }}
    >
      <h3 className={styles.header}>Begin Using This Software In Your Club!</h3>
      {
        {
          true: <Alert severity="success">Club registered successfully.</Alert>,
          false: (
            <Alert severity="warning">
              There was an error while adding your club, please try again.
            </Alert>
          ),
          undefined: null,
        }[registerSuccess]
      }
      <div className={styles.container}>
        <TextField
          error={attemptedSubmit && formErrors.clubName}
          className={styles.input}
          type="text"
          id="clubname"
          label="Club Name"
          required={true}
          value={newClub.clubName}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              clubName: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              clubName: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.clubName
              ? "Please enter your club name"
              : false
          }
        />

        <Autocomplete
          id="affiliation-selection"
          className={styles.input}
          value={
            newClub.affiliation === null
              ? ""
              : affiliationList.find((obj) =>
                  newClub.affiliation.includes(obj.value)
                ).label
          }
          isOptionEqualToValue={(option, value) => {
            return option.label === value || value === "";
          }}
          options={affiliationList}
          onChange={(e, value) => {
            setNewClub((state) => ({
              ...state,
              affiliation: value ? value.value : null,
            }));

            setFormErrors((state) => ({
              ...state,
              affiliation: value === null ? true : false,
            }));
          }}
          renderOption={(params, option) => {
            return (
              <li
                {...params}
                key={option.value}
              >
                {option.label}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              key={params.inputProps.value}
              required
              label="Your Club's Affiliation"
              error={attemptedSubmit && formErrors.affiliation}
              helperText={
                attemptedSubmit && formErrors.affiliation
                  ? "Please select your club's affiliation"
                  : false
              }
            />
          )}
        />

        <TextField
          error={attemptedSubmit && formErrors.address}
          className={styles.input}
          type="text"
          id="address"
          label="Address"
          required={true}
          value={newClub.address}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              address: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              address: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.address
              ? "Please enter your club address"
              : false
          }
        />

        <TextField
          error={attemptedSubmit && formErrors.city}
          className={styles.input}
          type="text"
          id="city"
          label="City"
          required={true}
          value={newClub.city}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              city: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              city: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.city ? "Please enter a city" : false
          }
        />

        <TextField
          error={attemptedSubmit && formErrors.zip}
          className={styles.input}
          type="text"
          id="zip"
          label="Zip Code"
          required={true}
          value={newClub.zip}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              zip: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              zip: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.zip
              ? "Please enter a zip code"
              : false
          }
        />

        <Autocomplete
          id="country-selection"
          className={styles.input}
          value={newClub.country}
          isOptionEqualToValue={(option, value) =>
            option.value === value || value === null
          }
          options={countries}
          onChange={(e, value) => {
            setNewClub((state) => ({
              ...state,
              country: value ? value.value : null,
            }));

            setFormErrors((state) => ({
              ...state,
              country: value === null ? true : false,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Your Club's Country"
              error={attemptedSubmit && formErrors.country}
              helperText={
                attemptedSubmit && formErrors.country
                  ? "Please select a country"
                  : false
              }
            />
          )}
        />

        <TextField
          error={attemptedSubmit && formErrors.contact}
          className={styles.input}
          type="text"
          id="contact"
          label="Contact Name"
          required={true}
          value={newClub.contact}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              contact: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              contact: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.contact
              ? "Please enter your club's main point of contact"
              : false
          }
        />

        <TextField
          error={attemptedSubmit && formErrors.email}
          className={styles.input}
          type="text"
          id="email"
          label="E-Mail"
          required={true}
          value={newClub.email}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              email: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              email: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.email
              ? "Please enter your club's contact e-mail"
              : false
          }
        />

        <TextField
          error={attemptedSubmit && formErrors.phone}
          className={styles.input}
          type="phone"
          id="phone"
          label="Phone Number"
          required={true}
          value={newClub.phone}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              phone: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              phone: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.phone
              ? "Please enter your club's phone number"
              : false
          }
        />

        <TextField
          error={attemptedSubmit && formErrors.website}
          className={styles.input}
          type="website"
          id="website"
          label="Your Club's Website"
          value={newClub.website}
          onChange={(e) => {
            setNewClub((state) => ({
              ...state,
              website: e.target.value,
            }));
            setFormErrors((state) => ({
              ...state,
              website: e.target.value.length > 0 ? false : true,
            }));
          }}
          helperText={
            attemptedSubmit && formErrors.website
              ? "Please enter your club's website"
              : false
          }
        />
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => handleRegister(newClub)}
          >
            Add Club
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setAddingClub(false);
              setLoggingIn(true);
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AddClub;
