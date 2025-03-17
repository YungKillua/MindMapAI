import React, { useContext, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import Menu from '@mui/material/Menu';
import MenuItem from "@mui/material/MenuItem";
import { MindmapContext } from "/src/components/Context";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SignUpModal from "/src/components/SignUpModal";
import { Snackbar, Alert } from "@mui/material";
import DarkModeToggle from "/src/components/DarkModeToggle";

const TopBar = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userCredentials = { username, password };
  const { isLoggedIn, setisLoggedIn, setSelectedMindmap, setCurrentMap, setMindmaps, darkMode, setDarkMode, animationEnabled, setAnimationEnabled} = useContext(MindmapContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuState, setMenuState] = useState("default"); // Zustand für das Menü (default oder settings)
  const open = Boolean(anchorEl);
  const [opensignup, setOpenSignup] = useState(false);

  // Snackbar Alerts
  const [openbar, setOpenBar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success'); // 'success' oder 'error'

  const animation = animationEnabled ? "on" : "off";
  const darkmode = darkMode ? "on" : "off";

  const Theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuState('default');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    setMenuState("settings"); // Setzt das Menü auf den Settings-Modus
  };

  const handleAnimationClick = () => {
    setAnimationEnabled((prev) => !prev);
  };

  const handleDarkmodeClick = () => {
    setDarkMode((prev) => !prev);
  }

  const handleLogin = async (userCredentials) => {
    try {
      const res = await axios.post(backendUrl + '/auth/login/', userCredentials);
      // User-Daten aus der API-Antwort
      setisLoggedIn(true); // React State setzen
      localStorage.setItem("token", res.data.access_token); // User-Daten im LocalStorage speichern
      setAlertMessage('Login successful');
      setAlertSeverity('success');
      setOpenBar(true);
    } catch (error) {
      console.error("Login fehlgeschlagen", error);
      setAlertMessage('Login failed');
      setAlertSeverity('error');
      setOpenBar(true);
    }
  };

  const handleLogout = () => {
    setisLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setSelectedMindmap(null);
    setCurrentMap([]);
    setMindmaps([]);
    handleClose();
  };

  return (
    <div className="bg-neutral-300 dark:bg-neutral-700 text-white p-2 flex justify-between items-center min-w-[100vw]">
      {/* Logo auf der linken Seite */}
      <div className="text-2xl font-bold pl-1 text-blue-500">BrainMap</div>
      <DarkModeToggle />
      
      {/* Login / Account-Icons */}
      <div className="flex items-center gap-2 h-10">
        {!isLoggedIn ? ( //Nicht eingeloggt
          <>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="bg-gray-700 text-white text-sm h-7.5 w-40 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-700 text-white text-sm h-7.5 w-40 px-3 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Login-Button */}
            <button
              className="bg-blue-900 hover:bg-blue-950 text-white py-1 px-4 rounded"
              onClick={() => handleLogin(userCredentials)}
            >
              Login
            </button>
            {/* Signup-Button */}
            <button
              className="bg-green-900 hover:bg-green-950 text-white py-1 px-4 rounded"
              onClick={() => setOpenSignup(true)}
            >
              Sign Up
            </button>
            <SignUpModal open={opensignup} onClose={() => setOpenSignup(false)} 
                         setOpenBar={setOpenBar} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity}
            />
          </>
        ) : ( //Eingeloggt 
          <>
            <button className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-white w-10 h-10 flex items-center justify-center rounded-full hover:outline-none hover:ring-2 hover:ring-black dark:hover:ring-amber-50 hover:cursor-pointer"
                    onClick={handleClick}
            >
              <User size={20} />
            </button>
            <ThemeProvider theme={Theme}>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {menuState === "default" ? (
                  <>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  // Hier werden die Settings-Optionen angezeigt, wenn `menuState` auf "settings" gesetzt ist
                  <>
                    <MenuItem onClick={handleClose}>Change Primary Color</MenuItem>
                    <MenuItem onClick={handleAnimationClick}>Animations: {animation}</MenuItem>
                    <MenuItem onClick={handleDarkmodeClick}>DarkMode: {darkmode}</MenuItem>
                    <MenuItem onClick={() => setMenuState('default')}>Back</MenuItem>
                  </>
                )}
              </Menu>
            </ThemeProvider>
          </>
        )}
      </div>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openbar} autoHideDuration={6000} onClose={() => setOpenBar(false)}>
        <Alert onClose={() => setOpenBar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TopBar;
