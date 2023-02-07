import React, { useState } from "react";

import { durationCalculation } from "../utils";

import { Popover, Card, Divider, CardHeader, CardContent } from "@mui/material";

import { theme } from "../theme";

import styles from "./SmallEventView.module.css";

function SmallEventView({ event, date, monthView }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.target);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card
      key={event._id}
      sx={{
        "&.MuiPaper-root": {
          backgroundColor:
            event.clothing.length === 2
              ? theme.palette.success.main
              : event.clothing.includes("GI")
              ? theme.palette.gi.main
              : theme.palette.noGi.main,
          overflow: "hidden",
          whiteSpace: monthView ? "nowrap" : "normal",
          color: "white",
          fontWeight: "bold",
          fontSize: monthView ? "calc(5px + .5vw)" : "calc(10px + .6vw)",
        },
      }}
      className={styles.smallEvent}
    >
      {monthView ? (
        <>
          {`${date.getHours()}:${
            date.getMinutes() < 10 ? date.getMinutes() + "0" : date.getMinutes()
          }`}{" "}
        </>
      ) : (
        <>
          <div>
            {`${date.getHours()}:${
              date.getMinutes() < 10
                ? date.getMinutes() + "0"
                : date.getMinutes()
            }`}
          </div>
        </>
      )}
      {event.openMat ? (
        "Open Mat"
      ) : (
        <>
          {event.level.length === 3
            ? "All Levels"
            : event.level.map((item) => item.substring(0, 3)).join(", ")}{" "}
          {event.group.length === 3 ? "All Ages" : event.group.join(", ")}
        </>
      )}
    </Card>
  );
}

export default SmallEventView;
