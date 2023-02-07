import React from "react";

import Preferences from "../Preferences/Preferences";
import PermissionsPanel from "../PermissionsPanel/PermissionsPanel";

// import Modal from "react-bootstrap/Modal";

import { Card, IconButton, Modal } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import styles from "./ControlPanel.module.css";

function ControlPanel({ props }) {
  const {
    controlPanelOpen,
    currentUser,
    setControlPanelOpen,
    clubList,
    setCurrentUser,
  } = props;

  return (
    <Modal
      open={controlPanelOpen}
      sx={{
        "&.MuiModal-root": {
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflowY: "auto",
          padding: "30px 0px",
        },
      }}
    >
      <Card className={styles.modalContainer}>
        <div className={styles.buttons}>
          <IconButton
            color="danger"
            onClick={() => {
              setControlPanelOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.wrapper}>
          <Preferences
            currentUser={currentUser}
            clubList={clubList}
          />
          <PermissionsPanel
            clubList={clubList}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>
      </Card>
    </Modal>
  );
}

export default ControlPanel;
