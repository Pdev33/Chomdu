import {
  Alert,
  Button,
  Card,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function Account() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    amount: 0,
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user/1`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      setSnackbarMessage("Email and password are required!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/user/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        if (!contentLength || contentLength === "0") {
          setSnackbarMessage("Profile updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          return;
        }

        const data = await response.json();
        console.info("Server response:", data);

        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setSnackbarMessage("Error updating profile!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <>
      <Header />
      <Card sx={{ m: 2 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ mt: 2, textAlign: "center" }}>
            Votre Profile
          </Typography>

          <TextField
            label="Username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={userData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            onClick={handleSubmit}
          >
            Sauvegarder
          </Button>
        </Container>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
