import React from "react";
import { useState, useEffect } from "react";

import styles from "./CalendarModal.module.css";

import {
  fetchData,
  postEvent,
  deleteEvent,
  putEvent,
} from "../requests/requests";

import { durationCalculation } from "../utils";

import dayjs from "dayjs";

import {
  TextField,
  Card,
  Slider,
  Modal,
  Button,
  Autocomplete,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { createFilterOptions } from "@mui/material/Autocomplete";

import CloseIcon from "@mui/icons-material/Close";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import CalendarModalEvent from "../CalendarModalEvent/CalendarModalEvent";

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

  const filter = createFilterOptions();

  //fetch data
  const callData = async () => {
    const result = await fetchData();

    result.data.sort((a, b) => a.name.localeCompare(b.name));

    setData(result.data);
  };

  //initial fetch
  useEffect(() => {
    callData();
  }, []);

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

  //checkbox arrays
  const clothing = [
    { label: "Gi", value: "GI" },
    { label: "No Gi", value: "No GI" },
  ];

  const groups = ["Kids", "Juniors", "Adults"];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <Modal
      open={modalVisibility}
      className={styles.wrapper}
    >
      <Card className={styles.accordion}>
        <Accordion expanded={addingEvent || editingEvent}>
          <AccordionSummary
            sx={{
              ".MuiAccordionSummary-content": { flexDirection: "column" },
              ".MuiAccordionSummary-content:hover": { cursor: "default" },
            }}
          >
            <div className={styles.modalWrapper}>
              <IconButton
                color="danger"
                onClick={() => {
                  displayModal();
                  setAddingEvent(false);
                  setEditingEvent(false);
                  setNewEventObject(blankEventObject);
                }}
              >
                <CloseIcon />
              </IconButton>
              <div className={styles.modalHeader}>
                <h4>
                  {weekdays[selectedDate.getDay()]},{" "}
                  {months[selectedDate.getMonth()]} {selectedDate.getDate()},{" "}
                  {selectedDate.getFullYear()}
                </h4>
                {dayEventList.length === 0 ? null : (
                  <h5>Scheduled Training Sessions</h5>
                )}
              </div>
              {dayEventList.length > 0 ? (
                <div className={styles.eventWrapper}>
                  {dayEventList.map((element) => {
                    const date = new Date(element.passTime);

                    return (
                      <CalendarModalEvent
                        key={element._id}
                        element={element}
                        userList={userList}
                        date={date}
                        currentClub={currentClub}
                        currentUser={currentUser}
                        initiateEdit={initiateEdit}
                        handleDelete={handleDelete}
                        addingEvent={addingEvent}
                        editingEvent={editingEvent}
                        newEventObject={newEventObject}
                      />
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
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setNewEventObject(blankEventObject);
                      setAddingEvent(true);
                    }}
                  >
                    Add New Training Session
                  </Button>
                </div>
              )
            ) : null}
          </AccordionSummary>
          <AccordionDetails>
            {/* <Collapse in={addingEvent || editingEvent}> */}
            <div className={styles.newEventWrapper}>
              <h5>New Training Session</h5>
              <div className={` ${styles.eventContainer}`}>
                <div className={styles.newEvent}>
                  <div className={styles.duration}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className={styles.time}
                        ampm={false}
                        minutesStep={15}
                        value={newEventObject.passTime}
                        onChange={(e) => {
                          setNewEventObject((state) => ({
                            ...state,
                            passTime: e,
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Time"
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <div className={styles.sliders}>
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
                        valueLabelFormat={`${
                          100 - newEventObject.sparringTime
                        }/${newEventObject.sparringTime} `}
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
                    </div>
                  </div>

                  <div className={styles.dropdowns}>
                    <Autocomplete
                      size="small"
                      className={styles.dropdown}
                      multiple
                      selectOnFocus
                      clearOnBlur
                      clearOnEscape
                      handleHomeEndKeys
                      value={newEventObject.coach}
                      onChange={(e, value, reason, details) => {
                        console.log(value);
                        setNewEventObject((state) => ({
                          ...state,
                          coach: value.map((item) => {
                            if (typeof item === "object") {
                              return item.inputValue;
                            } else {
                              return item;
                            }
                          }),
                        }));
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                          (option) => inputValue === option.value
                        );
                        if (inputValue !== "" && !isExisting) {
                          filtered.push({
                            inputValue,
                            label: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      options={userList
                        .map((user) => {
                          if (user.coach.includes(currentClub.value)) {
                            return {
                              inputValue: `${user.firstName} ${user.lastName}`,
                              label: `${user.firstName} ${user.lastName}`,
                            };
                          }
                        })
                        .filter((element) => element !== undefined)}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Coaches"
                        />
                      )}
                    />

                    <Autocomplete
                      size="small"
                      multiple
                      selectOnFocus
                      clearOnBlur
                      clearOnEscape
                      handleHomeEndKeys
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                          (option) => inputValue === option.label
                        );
                        if (inputValue !== "" && !isExisting) {
                          filtered.push({
                            inputValue,
                            label: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      className={styles.dropdown}
                      value={newEventObject.schema.map((item) => ({
                        inputValue: item,
                        label: item,
                      }))}
                      options={data.map((item) => ({
                        inputValue: item.name,
                        label: item.name,
                      }))}
                      onChange={(e, value) => {
                        setNewEventObject((state) => ({
                          ...state,
                          schema: value.map((item) => {
                            if (typeof item === "object") {
                              return item.inputValue;
                            } else {
                              return item;
                            }
                          }),
                        }));
                      }}
                      freeSolo
                      // sx={{ width: "50%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Agenda"
                        />
                      )}
                    />
                  </div>

                  <div className={styles.radioNotesContainer}>
                    <FormGroup>
                      {clothing.map((clothing, index) => {
                        return (
                          <FormControlLabel
                            sx={{
                              ".MuiCheckbox-root": {
                                padding: "5px 9px",
                              },
                            }}
                            key={clothing.label}
                            label={clothing.label}
                            control={
                              <Checkbox
                                color="secondary"
                                type="checkbox"
                                name="clothing"
                                checked={newEventObject.clothing.includes(
                                  clothing.value
                                )}
                                onChange={() => {
                                  if (
                                    newEventObject.clothing.includes(
                                      clothing.value
                                    )
                                  ) {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      clothing: state.clothing.filter(
                                        (value) => value !== clothing.value
                                      ),
                                    }));
                                  } else {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      clothing: [
                                        ...state.clothing,
                                        clothing.value,
                                      ],
                                    }));
                                  }
                                }}
                              />
                            }
                          />
                        );
                      })}
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        sx={{
                          ".MuiCheckbox-root": {
                            padding: "5px 9px",
                            overflow: "visible",
                          },
                        }}
                        label={"All Levels"}
                        control={
                          <Checkbox
                            type="checkbox"
                            color="secondary"
                            name="level"
                            checked={newEventObject.level.length === 3}
                            onChange={() => {
                              if (newEventObject.level.length === 3) {
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
                        }
                      />
                      {levels.map((level) => {
                        return (
                          <FormControlLabel
                            sx={{
                              ".MuiCheckbox-root": {
                                padding: "5px 9px",
                                overflow: "visible",
                              },
                            }}
                            label={level[0].toUpperCase() + level.substring(1)}
                            key={level}
                            control={
                              <Checkbox
                                type="checkbox"
                                color="secondary"
                                value={level}
                                name="level"
                                checked={newEventObject.level.includes(level)}
                                onChange={(e, checked) => {
                                  if (checked) {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      level: levels.filter(
                                        (item) =>
                                          item === e.target.value ||
                                          state.level.includes(item)
                                      ),
                                    }));
                                  } else {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      level: state.level.filter(
                                        (item) => item !== e.target.value
                                      ),
                                    }));
                                  }
                                }}
                              />
                            }
                          />
                        );
                      })}
                    </FormGroup>

                    <FormGroup>
                      <FormControlLabel
                        sx={{
                          ".MuiCheckbox-root": {
                            padding: "5px 9px",
                          },
                        }}
                        label="All Ages"
                        control={
                          <Checkbox
                            color="secondary"
                            type="checkbox"
                            name="group"
                            checked={newEventObject.group.length === 3}
                            onChange={() => {
                              if (newEventObject.group.length === 3) {
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
                        }
                      />
                      {groups.map((group) => {
                        return (
                          <FormControlLabel
                            sx={{
                              ".MuiCheckbox-root": {
                                padding: "5px 9px",
                              },
                            }}
                            label={group}
                            key={group}
                            control={
                              <Checkbox
                                color="secondary"
                                type="checkbox"
                                name="group"
                                value={group}
                                checked={newEventObject.group.includes(group)}
                                onChange={(e, checked) => {
                                  if (checked) {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      group: groups.filter(
                                        (item) =>
                                          item === e.target.value ||
                                          state.group.includes(item)
                                      ),
                                    }));
                                  } else {
                                    setNewEventObject((state) => ({
                                      ...state,
                                      group: state.group.filter(
                                        (item) => item !== e.target.value
                                      ),
                                    }));
                                  }
                                }}
                              />
                            }
                          />
                        );
                      })}
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        sx={{
                          ".MuiCheckbox-root": {
                            padding: "5px 9px",
                          },
                        }}
                        label="Special Event/Seminar"
                        control={
                          <Checkbox
                            type="checkbox"
                            color="warning"
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
                        }
                      />
                      <FormControlLabel
                        sx={{
                          ".MuiCheckbox-root": {
                            padding: "5px 9px",
                          },
                        }}
                        label="Open Mat"
                        control={
                          <Checkbox
                            type="checkbox"
                            color="secondary"
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
                        }
                      />
                    </FormGroup>
                  </div>
                  <TextField
                    className={styles.notes}
                    label="Notes"
                    value={newEventObject.notes}
                    onChange={(e) =>
                      setNewEventObject((state) => ({
                        ...state,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
                {/* </div> */}
                <div className={styles.saveContainer}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      editingEvent ? handleEdit() : handlePost();
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="contained"
                    color="danger"
                    onClick={() => {
                      setNewEventObject(blankEventObject);
                      setEditingEvent(false);
                      setAddingEvent(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            {/* </Collapse> */}
          </AccordionDetails>
        </Accordion>
      </Card>
    </Modal>
  );
}

export default CalendarModal;
