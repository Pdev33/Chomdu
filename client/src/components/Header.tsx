import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            textDecoration: "none",
            color: "inherit",
          }}
          component={Link}
          to="/"
        >
          Chomdu
        </Typography>
        <Button color="inherit" component={Link} to="/history">
          Historique
        </Button>
        <Button color="inherit" component={Link} to="/account">
          Compte
        </Button>
      </Toolbar>
    </AppBar>
  );
}
