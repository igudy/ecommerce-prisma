import { Router } from "express";
import { login, signUp } from "../controllers/auth";

const authRoutes: Router = Router();

authRoutes.post("/login", login);
authRoutes.post("/signUp", signUp);

export default authRoutes;
