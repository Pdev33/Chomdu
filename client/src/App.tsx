import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Button, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { darkTheme, lightTheme } from "../../client/src/components/Theme";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDarkMode(!darkMode)}
        startIcon={darkMode ? <Brightness7 /> : <Brightness4 />}
        sx={{ position: "fixed", top: 76, right: 16 }}
      />
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
