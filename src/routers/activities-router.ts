import { getActivities } from "@/controllers/activities-controlller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/:dateId", getActivities);

export { activitiesRouter };
