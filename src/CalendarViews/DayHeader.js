import React from "react";

import { Tooltip, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import styles from "./DayHeader.module.css";

function DayHeader({ matchingEvents, day }) {
  return (
    <div className={styles.dayHeader}>
      <Chip
        variant="filled"
        size="small"
        label={day ? day.getDate() : null}
        sx={{
          flexDirection: "row-reverse",
          backgroundColor: "black",
          color: "white !important",
        }}
        icon={
          matchingEvents(day).some(
            (element) => element.specialEvent === true
          ) ? (
            <Tooltip
              title="Special Event / Seminar"
              sx={{
                "&.MuiSvgIcon-root": {
                  color: "white",
                  marginLeft: "-4px",
                  marginRight: "4px",
                  marginTop: "-3px",
                },
              }}
            >
              <StarIcon />
            </Tooltip>
          ) : null
        }
      />
      {/* {matchingEvents(day).some((element) => element.specialEvent === true) ? (
        <Tooltip title="Special Event / Seminar">
          <StarIcon />
        </Tooltip>
      ) : null} */}
    </div>
  );
}

export default DayHeader;
