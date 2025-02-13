import type { RequestHandler } from "express";
import UserRepository from "./userRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserRepository.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await UserRepository.read(userId);
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      amount: req.body.amount,
    };
    const insertId = await UserRepository.create(newUser);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const updatedUser = {
      id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      amount: req.body.amount,
    };
    const success = await UserRepository.update(userId, updatedUser);
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
    const userId = Number(req.params.id);
    const success = await UserRepository.delete(userId);
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
