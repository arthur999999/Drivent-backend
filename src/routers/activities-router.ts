import { getActivities, getDates } from "@/controllers/activities-controlller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getDates)
  .get("/:dateId", getActivities);

export { activitiesRouter };
