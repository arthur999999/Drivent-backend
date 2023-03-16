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

