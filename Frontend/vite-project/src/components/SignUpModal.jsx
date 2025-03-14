import React, { useEffect } from "react";
import { Box } from "@mui/material";
import SignUpForm from "/src/components/SignUpForm";

const SignUpModal = ({ open, onClose, setOpenBar, setAlertMessage, setAlertSeverity}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Scrollbalken ausblenden
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open) return null;


  return (
    <>
      {/* Eigener Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparenter Hintergrund
          zIndex: 1200,
        }}
      />
      
      {/* Modal Box */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1301,
          width: 300, // Breite der Box
          bgcolor: "#424242", // Dunkler Hintergrund
          boxShadow: 24,
          p: 3, // Padding für mehr Platz
          borderRadius: 2, // Abgerundete Ecken
        }}
      > 
          <SignUpForm onClose={onClose} setOpenBar={setOpenBar} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity} />
      </Box>
    </>
  );
};

export default SignUpModal;
