import React from "react";
import { useEffect, useState } from "react";

import { getCountries, getAffiliations, postClub } from "../requests/requests";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { Typeahead } from "react-bootstrap-typeahead";

import Select from "react-select";
import Creatable, { useCreatable } from "react-select/creatable";

import affiliations from "../affiliations";

import styles from "./AddClub.module.css";

function AddClub(props) {
  const { setAddingClub } = props;

  const blankClub = {
    clubName: "",
    affiliation: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    contact: "",
    email: "",
    phone: "",
    website: "",
  };

  const [newClub, setNewClub] = useState(blankClub);

  const [countries, setCountries] = useState([]);

  const [affiliationList, setAffiliationList] = useState({});

  const [validated, setValidated] = useState(false);

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

  const handleRegister = async (e) => {
    setAttemptedSubmit(true);
    e.preventDefault();

    if (e.target.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      const result = await postClub(newClub);
      if (result.data) {
        setRegisterSuccess(true);
      } else {
        setRegisterSuccess(false);
      }
    }
  };

  useEffect(() => {
    console.log(newClub);
  }, [newClub]);

  return (
    <Card className={`p-3 m-3 ${styles.card}`}>
      <Card className={`p-3 m-3`}>
        <h3>Begin Using This Software In Your Club!</h3>
      </Card>
      {
        {
          true: <Alert variant="success">Club registered successfully.</Alert>,
          false: (
            <Alert variant="warning">
              There was an error while adding your club, please try again.
            </Alert>
          ),
          undefined: null,
        }[registerSuccess]
      }
      <Form
        noValidate
        validated={validated}
        onSubmit={handleRegister}
      >
        <FloatingLabel
          label="Club Name"
          className="mb-3"
        >
          <Form.Control
            required
            isValid={!formErrors.clubName}
            isInvalid={attemptedSubmit && formErrors.clubName}
            type="text"
            name="club"
            placeholder="Club Name"
            value={newClub.clubName}
            onChange={(e) => {
              setNewClub((state) => ({ ...state, clubName: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                clubName: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club name
          </Form.Control.Feedback>
        </FloatingLabel>

        <Form.Group className="mb-3">
          <Typeahead
            id="affiliation"
            required
            isValid={!formErrors.affiliation}
            isInvalid={attemptedSubmit && formErrors.affiliation}
            placeholder="Select your affiliation"
            className={` ${styles.select} ${
              attemptedSubmit && formErrors.affiliation
                ? "is-invalid"
                : "is-valid"
            }
            `}
            isClearable
            options={affiliationList}
            onChange={(e) => {
              e.length === 1
                ? setNewClub((state) => ({ ...state, affiliation: e[0].value }))
                : setNewClub((state) => ({ ...state, affiliation: "" }));
              setFormErrors((state) => ({
                ...state,
                affiliation:
                  e.length === 1
                    ? e[0].value.length > 0
                      ? false
                      : true
                    : true,
              }));
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please select an affiliation
          </Form.Control.Feedback>
        </Form.Group>

        <FloatingLabel
          label="Address"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="address"
            isValid={!formErrors.address}
            isInvalid={attemptedSubmit && formErrors.address}
            placeholder="Address"
            value={newClub.address}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, address: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                address: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club address
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="City"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="city"
            isValid={!formErrors.city}
            isInvalid={attemptedSubmit && formErrors.city}
            placeholder="City"
            value={newClub.city}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, city: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                city: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club's city
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Zip Code"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="zip"
            isValid={!formErrors.zip}
            isInvalid={attemptedSubmit && formErrors.zip}
            placeholder="Zip Code"
            value={newClub.zip}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, zip: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                zip: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club's zip code
          </Form.Control.Feedback>
        </FloatingLabel>
        <Form.Group className="mb-3">
          <Typeahead
            placeholder="Country"
            className={`${styles.select} ${
              attemptedSubmit && formErrors.country ? "is-invalid" : "is-valid"
            }`}
            isValid={!formErrors.country}
            isInvalid={attemptedSubmit && formErrors.country}
            options={countries}
            onChange={(e) => {
              e.length === 1
                ? setNewClub((state) => ({ ...state, country: e.value }))
                : setNewClub((state) => ({ ...state, country: "" }));
              setFormErrors((state) => ({
                ...state,
                country:
                  e.length === 1
                    ? e[0].value.length > 0
                      ? false
                      : true
                    : true,
              }));
            }}
          />
          <Form.Control.Feedback type="invalid">
            Please select your country
          </Form.Control.Feedback>
        </Form.Group>

        <FloatingLabel
          label="Contact Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            name="name"
            isValid={!formErrors.zip}
            isInvalid={attemptedSubmit && formErrors.zip}
            placeholder="Contact Name"
            value={newClub.contact}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, contact: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                name: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club contact's full name
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Club Contact E-mail"
          className="mb-3"
        >
          <Form.Control
            type="email"
            name="email"
            isValid={!formErrors.email}
            isInvalid={attemptedSubmit && formErrors.email}
            placeholder="E-Mail"
            value={newClub.email}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, email: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                email: e.target.value.match(
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                )
                  ? false
                  : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club contact e-mail
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Phone"
          className="mb-3"
        >
          <Form.Control
            type="phone"
            name="phone"
            isValid={!formErrors.phone}
            isInvalid={attemptedSubmit && formErrors.phone}
            placeholder="Phone"
            value={newClub.phone}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, phone: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                phone: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club's contact phone number
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel
          label="Website"
          className="mb-3"
        >
          <Form.Control
            type="website"
            name="website"
            isValid={!formErrors.website}
            isInvalid={attemptedSubmit && formErrors.website}
            placeholder="Website"
            value={newClub.website}
            required
            onChange={(e) => {
              setNewClub((state) => ({ ...state, website: e.target.value }));
              setFormErrors((state) => ({
                ...state,
                website: e.target.value.length > 0 ? false : true,
              }));
            }}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter your club website address
          </Form.Control.Feedback>
        </FloatingLabel>

        <Button
          className="m-2"
          type="submit"
        >
          Add Club
        </Button>

        <Button onClick={() => setAddingClub(false)}>Back to Login</Button>
      </Form>
    </Card>
  );
}

export default AddClub;
