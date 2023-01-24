import React from "react";
import { useState, useEffect } from "react";

import styles from "./CalendarModal.module.css";

import {
  fetchData,
  postEvent,
  deleteEvent,
  putEvent,
} from "../requests/requests";

import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import CloseButton from "react-bootstrap/CloseButton";

import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import dayjs from "dayjs";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Slider from "@mui/material/Slider";

import Creatable from "react-select/creatable";

import { Trash, Pencil } from "react-bootstrap-icons";

function CalendarModal({ props }) {
  const {
    modalVisibility,
    selectedDate,
    events,
    displayModal,
    weekdays,
    months,
    setEvents,
    currentUser,
    userList,
    durationCalculation,
    currentClub,
  } = props;

  const blankEventObject = {
    passTime: dayjs(selectedDate),
    duration: 90,
    sparringTime: 50,
    schema: [],
    coach: [],
    clothing: [],
    level: [],
    group: [],
    openMat: false,
    specialEvent: false,
    notes: "",
    clubId: currentClub.value,
    addedBy: currentUser._id,
  };

  const [newEventObject, setNewEventObject] = useState(blankEventObject);

  const [data, setData] = useState([]);

  const [editingEvent, setEditingEvent] = useState(false);

  const [addingEvent, setAddingEvent] = useState(false);

  //fetch data
  const callData = async (category) => {
    const result = await fetchData();

    result.data.sort((a, b) => a.name.localeCompare(b.name));

    setData(result.data);
  };

  //initial fetch
  useEffect(() => {
    callData();
  }, []);

  // accordion toggle button in modal
  function AccordionToggle({ children, eventKey, id, variant }) {
    const toggleAccordion = useAccordionButton(eventKey);

    return <div onClick={() => toggleAccordion()}>{children}</div>;
  }

  function initiateEdit(id) {
    const result = events.find((object) => object._id === id);
    result.passTime = new Date(result.passTime);
    setNewEventObject(result);
    setEditingEvent(true);
  }

  // construct event list for day
  let dayEventList = selectedDate
    ? events.filter((event) => {
        return (
          new Date(event.passTime).getYear() === selectedDate.getYear() &&
          new Date(event.passTime).getMonth() === selectedDate.getMonth() &&
          new Date(event.passTime).getDate() === selectedDate.getDate()
        );
      })
    : null;

  //delete event handler

  const handleDelete = (id) => {
    deleteEvent(id);
    setEvents((state) => state.filter((element) => element._id !== id));
  };

  //post event handler

  const handlePost = async () => {
    const result = await postEvent(newEventObject);

    const newEventList = [
      ...events,
      { ...newEventObject, _id: result.data.insertedId },
    ];

    newEventList.sort(
      (a, b) => new Date(a.passTime).getTime() - new Date(b.passTime).getTime()
    );

    setEvents(newEventList);

    setNewEventObject(blankEventObject);
    setAddingEvent(false);
  };

  //edit event handler

  const handleEdit = () => {
    putEvent(newEventObject);

    const newEventList = events.map((object) => {
      if (object._id === newEventObject._id) {
        return newEventObject;
      } else {
        return object;
      }
    });

    newEventList.sort(
      (a, b) => new Date(a.passTime).getTime() - new Date(b.passTime).getTime()
    );

    setEvents(newEventList);

    setNewEventObject(blankEventObject);
    setEditingEvent(false);
  };

  //group checkbox creation
  const groups = ["Kids", "Juniors", "Adults"];

  const groupCheckboxes = groups.map((group) => {
    return (
      <Form.Check
        type="checkbox"
        name="group"
        label={group[0].toUpperCase() + group.substring(1)}
        checked={newEventObject.group.includes(group)}
        onChange={() => {
          if (newEventObject.group.includes(group)) {
            setNewEventObject((state) => ({
              ...state,
              group: state.group.filter((value) => value !== group),
            }));
          } else {
            setNewEventObject((state) => ({
              ...state,
              group: [...state.group, group],
            }));
          }
        }}
      />
    );
  });

  //level checkbox creation
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const levelCheckboxes = levels.map((level, index) => {
    return (
      <Form.Check
        type="checkbox"
        name="level"
        label={level[0].toUpperCase() + level.substring(1)}
        checked={newEventObject.level.includes(level)}
        onChange={() => {
          if (newEventObject.level.includes(level)) {
            setNewEventObject((state) => ({
              ...state,
              level: state.level.filter((value) => value !== level),
            }));
          } else {
            setNewEventObject((state) => ({
              ...state,
              level: [...state.level, level],
            }));
          }
        }}
      />
    );
  });

  return (
    <Modal
      show={modalVisibility}
      className={styles.wrapper}
    >
      <Accordion className={styles.accordion}>
        <div className={styles.modalWrapper}>
          <CloseButton
            onClick={() => {
              displayModal();
              setAddingEvent(false);
              setEditingEvent(false);
              setNewEventObject(blankEventObject);
            }}
          />
          <h4>
            {weekdays[selectedDate.getDay()]}, {months[selectedDate.getMonth()]}{" "}
            {selectedDate.getDate()}, {selectedDate.getFullYear()}
          </h4>

          {dayEventList.length === 0 ? null : (
            <h5>Scheduled Training Sessions</h5>
          )}
          {dayEventList.length > 0 ? (
            <div className={styles.eventWrapper}>
              {dayEventList.map((element) => {
                const date = new Date(element.passTime);

                return (
                  <Card
                    key={element._id}
                    className={`m-1 ${styles.eventCard}`}
                  >
                    <Card.Header
                      style={{
                        backgroundColor: element.specialEvent
                          ? "#ffc107"
                          : "#144659",
                        color: element.specialEvent ? "black" : "white",
                      }}
                      className={` ${styles.eventHeader}`}
                    >
                      <h6 className="m-0">
                        {element.specialEvent
                          ? "Special Event/ Seminar"
                          : element.openMat
                          ? "Open Mat"
                          : "Standard Training Session"}
                      </h6>
                      <div>
                        Added By:{" "}
                        {userList.map((item) => {
                          if (item._id === element.addedBy) {
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
                          <h4 className="m-0">
                            {date.getHours()}:
                            {date.getMinutes() < 10
                              ? date.getMinutes() + "0"
                              : date.getMinutes()}
                          </h4>
                        </div>
                        <Card
                          bg="muted"
                          className={`p-0 my-1 ${styles.cardField}`}
                          text="dark"
                        >
                          <Card.Body
                            className={` p-2 mb-0 ${styles.cardColumns}`}
                          >
                            <div className={styles.rowOne}>
                              <div>
                                <span className={styles.bold}>Agenda: </span>
                                {element.schema.length > 0
                                  ? element.schema.map((item, index) => {
                                      if (
                                        element.schema.length === 1 ||
                                        element.schema.length === index + 1
                                      ) {
                                        return item;
                                      } else {
                                        return item + " & ";
                                      }
                                    })
                                  : "Agenda is empty"}
                              </div>
                              <div>
                                <span className={styles.bold}>Duration: </span>
                                {durationCalculation(element.duration)}
                              </div>

                              <div>
                                <span className={styles.bold}>
                                  Drilling/Sparring:{" "}
                                </span>
                                {`${100 - element.sparringTime}/${
                                  element.sparringTime
                                }`}
                              </div>

                              <div>
                                <span className={styles.bold}>Coach: </span>
                                {element.coach.length > 0
                                  ? element.coach.map((item, index) => {
                                      if (
                                        element.coach.length === 1 ||
                                        element.coach.length === index + 1
                                      ) {
                                        return item.label;
                                      } else {
                                        return item.label + " & ";
                                      }
                                    })
                                  : "No coach assigned"}
                              </div>
                            </div>
                            <div className={styles.rowTwo}>
                              <div>
                                <span className={styles.bold}>Clothing: </span>
                                {element.clothing.join(" / ")}
                              </div>
                              <div>
                                <span className={styles.bold}>Levels: </span>
                                {element.level.length === 3
                                  ? "All levels"
                                  : element.level.join(", ")}
                              </div>

                              <div>
                                {" "}
                                <span className={styles.bold}>Groups: </span>
                                {element.group.length === 3
                                  ? "All Ages"
                                  : element.group.join(", ")}
                              </div>
                            </div>
                          </Card.Body>

                          {element.notes.length > 0 ? (
                            <Card.Footer
                              style={{ backgroundColor: "transparent" }}
                              className="p-2"
                            >
                              <span className={styles.bold}>Notes: </span>
                              {element.notes}
                            </Card.Footer>
                          ) : null}
                        </Card>
                        {currentUser.writeAccess.includes(currentClub.value) ? (
                          <div className={`m-1 ${styles.listBtns}`}>
                            {editingEvent || addingEvent ? null : (
                              <>
                                <AccordionToggle eventKey="0">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Edit</Tooltip>}
                                    delay={{ show: 400, hide: 100 }}
                                  >
                                    <Button
                                      variant="secondary"
                                      className="p-2"
                                      id={element._id}
                                      onClick={(event) => {
                                        initiateEdit(event.currentTarget.id);
                                      }}
                                    >
                                      <Pencil
                                        size={20}
                                        color="white"
                                      ></Pencil>
                                    </Button>
                                  </OverlayTrigger>
                                </AccordionToggle>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Delete</Tooltip>}
                                  delay={{ show: 400, hide: 100 }}
                                >
                                  <Button
                                    variant="danger"
                                    className="p-2"
                                    id={element._id}
                                    onClick={(e) => {
                                      handleDelete(e.currentTarget.id);
                                    }}
                                  >
                                    <Trash size={20}></Trash>
                                  </Button>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className={styles.noSessionMessage}>
              No sessions scheduled yet!
            </div>
          )}
        </div>

        {currentUser.writeAccess.includes(currentClub.value) ? (
          editingEvent || addingEvent ? null : (
            <div className={styles.addEvent}>
              <AccordionToggle eventKey="0">
                <Button
                  variant="success"
                  onClick={() => {
                    setNewEventObject(blankEventObject);
                    setAddingEvent(true);
                  }}
                >
                  Add New Training Session
                </Button>
              </AccordionToggle>
            </div>
          )
        ) : null}
        <Accordion.Collapse eventKey="0">
          <div className={styles.modalWrapper}>
            <h5>New Training Session</h5>
            <Card className={` ${styles.eventContainer}`}>
              {/* <div className={styles.newEvent}> */}
              <Form className={styles.newEvent}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    className={styles.time}
                    placeholder="Select Time"
                    ampm={false}
                    minutesStep={15}
                    value={newEventObject.passTime}
                    onChange={(e) => {
                      setNewEventObject((state) => ({
                        ...state,
                        passTime: e,
                      }));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Card className={styles.duration}>
                  <div className={styles.sliderLabel}>
                    <label>Duration</label>
                  </div>
                  <Slider
                    value={newEventObject.duration}
                    aria-label="Sparring"
                    id="sparring"
                    defaultValue={90}
                    min={0}
                    max={480}
                    step={15}
                    valueLabelDisplay="auto"
                    valueLabelFormat={durationCalculation(
                      newEventObject.duration
                    )}
                    onChange={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        duration: e.target.value,
                      }))
                    }
                  />

                  <Slider
                    value={newEventObject.sparringTime}
                    aria-label="Sparring"
                    id="sparring"
                    defaultValue={50}
                    min={0}
                    max={100}
                    step={25}
                    valueLabelDisplay="auto"
                    valueLabelFormat={`${100 - newEventObject.sparringTime}/${
                      newEventObject.sparringTime
                    } `}
                    onChange={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        sparringTime: e.target.value,
                      }))
                    }
                  />
                  <div className={styles.sliderLabel}>
                    <label>Drilling</label>
                    <label>Sparring</label>
                  </div>
                </Card>

                <div className={styles.dropdowns}>
                  <Creatable
                    isMulti
                    placeholder="Select Coaches"
                    value={newEventObject.coach}
                    options={userList
                      .map((user) => {
                        if (user.coach.includes(currentClub.value)) {
                          return {
                            value: user._id,
                            label: `${user.firstName} ${user.lastName}`,
                          };
                        }
                      })
                      .filter((element) => element !== undefined)}
                    onChange={(e) =>
                      setNewEventObject((state) => ({ ...state, coach: e }))
                    }
                    onCreateOption={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        coach: [...state.coach, { value: null, label: e }],
                      }))
                    }
                  />

                  <Creatable
                    isMulti
                    placeholder="Select Agenda"
                    value={newEventObject.schema.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    options={data.map((item) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                    onChange={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        schema: e.map((item) => item.value),
                      }))
                    }
                    onCreateOption={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        schema: [...state.schema, e],
                      }))
                    }
                  />
                </div>

                <div className={styles.radioNotesContainer}>
                  <Card className={` p-2 ${styles.radioCard}`}>
                    <div>
                      <Form.Check
                        type="checkbox"
                        name="clothing"
                        label="Gi"
                        checked={newEventObject.clothing.includes("GI")}
                        onChange={() => {
                          if (newEventObject.clothing.includes("GI")) {
                            setNewEventObject((state) => ({
                              ...state,
                              clothing: state.clothing.filter(
                                (value) => value !== "GI"
                              ),
                            }));
                          } else {
                            setNewEventObject((state) => ({
                              ...state,
                              clothing: [...state.clothing, "GI"],
                            }));
                          }
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        name="clothing"
                        label="No Gi"
                        checked={newEventObject.clothing.includes("No GI")}
                        onChange={() => {
                          if (newEventObject.clothing.includes("No GI")) {
                            setNewEventObject((state) => ({
                              ...state,
                              clothing: state.clothing.filter(
                                (value) => value !== "No GI"
                              ),
                            }));
                          } else {
                            setNewEventObject((state) => ({
                              ...state,
                              clothing: [...state.clothing, "No GI"],
                            }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Form.Check
                        type="checkbox"
                        name="level"
                        label="All Levels"
                        checked={
                          newEventObject.level.includes("Beginner") &&
                          newEventObject.level.includes("Intermediate") &&
                          newEventObject.level.includes("Advanced")
                        }
                        onChange={() => {
                          if (
                            newEventObject.level.includes("Beginner") &&
                            newEventObject.level.includes("Intermediate") &&
                            newEventObject.level.includes("Advanced")
                          ) {
                            setNewEventObject((state) => ({
                              ...state,
                              level: [],
                            }));
                          } else {
                            setNewEventObject((state) => ({
                              ...state,
                              level: levels,
                            }));
                          }
                        }}
                      />
                      {levelCheckboxes}
                    </div>
                    <div>
                      <Form.Check
                        type="checkbox"
                        name="group"
                        label={"All"}
                        checked={
                          newEventObject.group.includes("Kids") &&
                          newEventObject.group.includes("Juniors") &&
                          newEventObject.group.includes("Adults")
                        }
                        onChange={() => {
                          if (
                            newEventObject.group.includes("Kids") &&
                            newEventObject.group.includes("Juniors") &&
                            newEventObject.group.includes("Adults")
                          ) {
                            setNewEventObject((state) => ({
                              ...state,
                              group: [],
                            }));
                          } else {
                            setNewEventObject((state) => ({
                              ...state,
                              group: groups,
                            }));
                          }
                        }}
                      />
                      {groupCheckboxes}
                    </div>
                    <div>
                      <Form.Check
                        type="checkbox"
                        label="Special Event/Seminar"
                        checked={newEventObject.specialEvent}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setNewEventObject((state) => ({
                              ...state,
                              specialEvent: e.target.checked,
                            }));
                          } else {
                            setNewEventObject((state) => ({
                              ...state,
                              openMat: false,
                              specialEvent: e.target.checked,
                            }));
                          }
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Open Mat"
                        checked={newEventObject.openMat}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setNewEventObject((state) => ({
                              ...state,
                              openMat: e.target.checked,
                              level: [],
                              group: [],
                              sparringTime: 50,
                            }));
                          } else if (e.target.checked) {
                            setNewEventObject((state) => ({
                              ...state,
                              openMat: e.target.checked,
                              specialEvent: false,
                              level: levels,
                              group: groups,
                              sparringTime: 100,
                            }));
                          }
                        }}
                      />
                    </div>
                  </Card>
                </div>
                <FloatingLabel
                  label="Notes"
                  className={styles.notes}
                >
                  <Form.Control
                    as="textarea"
                    placeholder="notes"
                    value={newEventObject.notes}
                    onChange={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        notes: e.target.value,
                      }))
                    }
                  ></Form.Control>
                </FloatingLabel>
              </Form>
              {/* </div> */}
              <div className={styles.saveContainer}>
                <AccordionToggle eventKey="0">
                  <Button
                    variant="success"
                    onClick={() => {
                      editingEvent ? handleEdit() : handlePost();
                    }}
                  >
                    Save
                  </Button>
                </AccordionToggle>
                <AccordionToggle eventKey="0">
                  <Button
                    variant="danger"
                    onClick={() => {
                      setNewEventObject(blankEventObject);
                      setEditingEvent(false);
                      setAddingEvent(false);
                    }}
                  >
                    Cancel
                  </Button>
                </AccordionToggle>
              </div>
            </Card>
          </div>
        </Accordion.Collapse>
      </Accordion>
    </Modal>
  );
}

export default CalendarModal;
