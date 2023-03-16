import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/:dateId");
export { activitiesRouter };
