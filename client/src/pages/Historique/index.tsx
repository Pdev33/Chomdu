import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Expense {
  id: number;
  category: string;
  date: string;
  amount: number;
}

export default function History() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch("/api/expenses")
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  return (
    <Container maxWidth="sm" sx={{}}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={(_e, newValue) => setTabValue(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab
            label="Historique"
            sx={{ color: tabValue === 0 ? "red" : "white" }}
          />
          <Tab label="Compte" sx={{ color: "white" }} />
        </Tabs>
      </Box>

      <Box>
        <Typography variant="h6">Rechercher une dépense</Typography>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", margin: 1 }}
        >
          Par Date
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", margin: 1 }}
        >
          Par Catégorie
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", margin: 1 }}
        >
          Montant
        </Button>
      </Box>

      <Box>
        <Typography variant="h6">Liste des dépenses</Typography>
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={`❌ ${expense.category}`}
                secondary={expense.date}
                sx={{ color: "white" }}
              />
              <Typography sx={{ color: "white" }}>{expense.amount}€</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
