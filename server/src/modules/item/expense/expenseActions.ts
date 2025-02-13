import type { RequestHandler } from "express";

import ExpenseRepository from "./expenseRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const expenses = await ExpenseRepository.readAll();
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const expenseId = Number(req.params.id);
    const expense = await ExpenseRepository.read(expenseId);
    if (expense == null) {
      res.sendStatus(404);
    } else {
      res.json(expense);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newExpense = {
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      user_id: req.body.user_id,
    };
    const insertId = await ExpenseRepository.create(newExpense);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const expenseId = Number(req.params.id);
    const updatedExpense = {
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      user_id: req.body.user_id,
    };
    const success = await ExpenseRepository.update(expenseId, updatedExpense);
    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const expenseId = Number(req.params.id);
    const success = await ExpenseRepository.delete(expenseId);
    if (success) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, update, destroy };
