import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const DeleteModal = ({ onConfirm, onCancel}) => {
  const [open, setOpen] = useState(true);
  
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
      <div className="hover:cursor-default"
        onClick={() => {
          setOpen(false);
          onCancel();
        }}
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
          cursor: 'default'
        }}
      > 
        <div className="flex gap-4 justify-center">
          <button
            className="w-32 bg-green-900 hover:bg-green-950 hover:cursor-pointer text-white py-1 px-10 rounded"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </button>
          <button
            className="w-32 bg-red-900 hover:bg-red-950 hover:cursor-pointer text-white py-1 px-10 rounded"
            onClick={() => {
              onCancel();
              setOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </Box>
    </>
  );
};

export default DeleteModal;
