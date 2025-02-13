import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import type { Expense } from "../../../../server/src/modules/item/expense/expenseRepository";
import type { user } from "../../../../server/src/modules/item/user/userRepository";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = `${import.meta.env.VITE_API_URL}/api/expense`;

const categories = [
  "alimentation",
  "transport",
  "logement",
  "loisirs",
  "autres",
];

export default function Home() {
  const [user, setUser] = useState<user | null>(null);
  const [open, setOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    user_id: 1,
  });

  useEffect(() => {
    fetchExpenses();
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/1`,
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des dépenses");
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (
      !newExpense.description ||
      !newExpense.amount ||
      !newExpense.category ||
      !newExpense.date
    )
      return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de la dépense");

      const newExp = await response.json();
      setExpenses([...expenses, newExp]);
      setOpen(false);
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        date: "",
        user_id: 1,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((cat) =>
          expenses
            .filter((exp) => exp.category === cat)
            .reduce((acc, exp) => acc + Number.parseFloat(exp.amount), 0),
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <>
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

      <Container sx={{ mt: 4 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Mon budget : {user ? `${user.amount}€` : "Chargement..."}{" "}
            </Typography>
            <Typography>
              Solde restant :{" "}
              {user
                ? Number(user.amount) -
                  expenses.reduce(
                    (acc, exp) => acc + Number.parseFloat(exp.amount),
                    0,
                  )
                : "Chargement..."}
              €
            </Typography>
            <Typography>
              Total dépenses :{" "}
              {expenses.reduce(
                (acc, exp) => acc + Number.parseFloat(exp.amount),
                0,
              )}
              €
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Doughnut data={chartData} />
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Liste des dernières dépenses</Typography>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <List>
              {expenses.slice(-5).map((expense) => (
                <ListItem
                  key={expense.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={expense.description}
                    secondary={`${expense.amount}€ - ${expense.category}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Ajouter
          </Button>
        </Box>
      </Container>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ajouter une dépense
          </Typography>
          <TextField
            fullWidth
            label="Description"
            sx={{ mb: 2 }}
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Montant"
            type="number"
            sx={{ mb: 2 }}
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
          />
          <TextField
            select
            fullWidth
            label="Catégorie"
            sx={{ mb: 2 }}
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Date"
            type="date"
            sx={{ mb: 2 }}
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => addExpense().then(() => fetchExpenses())}
          >
            Valider
          </Button>
        </Box>
      </Modal>
    </>
  );
}
