import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    throw Error("User already exists!");
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    throw Error("User does not exists!");
  }

  if (!compareSync(password, user.password)) {
    throw Error("Incorrect Password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};
