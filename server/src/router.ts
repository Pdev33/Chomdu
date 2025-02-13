import express from "express";

const router = express.Router();

/* ************************************************************************* */
import expenseActions from "./modules/item/expense/expenseActions";
router.get("/api/expense", expenseActions.browse);
router.get("/api/expense/:id", expenseActions.read);
router.post("/api/expense", expenseActions.add);
router.put("/api/expense/:id", expenseActions.update);
router.delete("/api/expense/:id", expenseActions.destroy);
/* ************************************************************************* */
import userActions from "./modules/item/user/userActions";
router.get("/api/user", userActions.browse);
router.get("/api/user/:id", userActions.read);
router.post("/api/user", userActions.add);
router.put("/api/user/:id", userActions.update);
router.delete("/api/user/:id", userActions.destroy);
/* ************************************************************************* */
export default router;
