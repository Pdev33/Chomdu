import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

interface Expense {
  id: number;
  category: string;
  date: string;
  amount: string;
  description: string;
}
const API_URL = `${import.meta.env.VITE_API_URL}/api/expense`;
export default function History() {
  const [, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/expense`)
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
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

  const sortedExpenses = [...expenses].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === "category") {
      comparison = a.category.localeCompare(b.category);
    }
    if (sortBy === "amount") {
      comparison = Number.parseFloat(a.amount) - Number.parseFloat(b.amount);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Card sx={{ mt: 2, p: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ backgroundColor: "", textAlign: "center", mt: 4 }}
            >
              Historique des dépenses
            </Typography>
            <List>
              {sortedExpenses.map((expense) => (
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
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                  }}
                >
                  <ListItemText
                    primary={` ${expense.description} (${expense.category}) - ${expense.amount}€`}
                    secondary={`${expense.date}`}
                    sx={{
                      color: "inherit",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Card>
        <Card sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ textAlign: "center", m: 2 }}>
            Trier vos dépenses
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}
          >
            <Button variant="contained" onClick={() => handleSort("date")}>
              Par Date{" "}
              {sortBy === "date" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </Button>
            <Button variant="contained" onClick={() => handleSort("category")}>
              Par Catégorie{" "}
              {sortBy === "category" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </Button>
            <Button variant="contained" onClick={() => handleSort("amount")}>
              Par Montant{" "}
              {sortBy === "amount" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
}
