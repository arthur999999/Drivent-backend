import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getDates(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const response = await activitiesService.getDates(userId);

    res.send(response);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  } 
}

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { dateId } = req.params;

    const response = await activitiesService.getActivities(userId, Number(dateId));

    res.send(response);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  } 
}

export async function selectActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activityId } = req.params;

    const activity = await activitiesService.getActivityById(Number(activityId));
    if(activity.vacancies === 0) {
      res.sendStatus(400);
    }
    await activitiesService.isSameHour(userId, activity);
    await activitiesService.createSubscription(userId, Number(activityId));

    res.sendStatus(200);
  } catch (error) {
    if(error.name === "NotFoundError") {
      res.sendStatus(404);
      return;
    }
    if (error.name === "ConflictError") {
      res.sendStatus(httpStatus.CONFLICT);
      return;
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

