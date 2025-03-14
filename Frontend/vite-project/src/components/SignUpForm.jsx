import React, { useState } from "react";
import { Box, Button} from "@mui/material";
import axios from "axios";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const SignUpForm = ({onClose, setOpenBar, setAlertMessage, setAlertSeverity}) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Überprüfen, ob alle Felder ausgefüllt sind
    if (!username || !email || !password) {
        setAlertMessage('Please fill in all fields');
        setAlertSeverity('error');
        setOpenBar(true);
        return; // Beende die Funktion, falls ein Feld leer ist
    }

    const newUser = { username, email, password };

    try {
        const response = await axios.post(backendUrl + '/auth/register/', newUser);
        setMessage(response.data.message);
        setAlertMessage('Signup successful');
        setAlertSeverity('success');
        setOpenBar(true);
        onClose();
    } catch (error) {
        setMessage("Error: " + (error.response?.data?.detail || "An unknown error occurred"));
        setAlertMessage('Signup failed');
        setAlertSeverity('error');
        setOpenBar(true);
        }
    };


  return (
<Box
  component="form"
  noValidate
  autoComplete="off"
  onSubmit={handleSubmit}
  display="flex"
  flexDirection="column"
  alignItems="center"
  sx={{ mt: 2 }}
>
  <input
    type="text"
    id="username"
    placeholder="Username"
    className="bg-gray-700 text-white text-sm h-8 w-60 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
    required
    onChange={(e) => setUsername(e.target.value)}
  />
  <input
    type="email"
    id="email"
    placeholder="Email"
    className="bg-gray-700 text-white text-sm h-8 w-60 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
    required
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    id="password"
    placeholder="Password"
    className="bg-gray-700 text-white text-sm h-8 w-60 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
    required
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* Container für HCaptcha, um es auf die gleiche Breite zu bringen */}
  <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
    <HCaptcha
      sitekey="your-sitekey"
      onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
      style={{ maxWidth: "60ch", width: "100%" }} // Limitiert die Breite
    />
  </Box>

  <Box display="flex" justifyContent="center" mt={2} width="100%">
    <Button
      type="submit"
      variant="contained"
      color="primary"
      sx={{
        width: "100%",
        maxWidth: "60ch",
        bgcolor: "#1e3a8a",
        "&:hover": { bgcolor: "#1e3a5f" },
      }}
    >
      Sign Up
    </Button>
  </Box>
</Box>

  );
};

export default SignUpForm;
