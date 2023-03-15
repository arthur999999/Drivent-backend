import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { dateId } = req.params;

    const response = activitiesService.getActivities(userId, Number(dateId));

    res.send(response);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  } 

  return res.send(req.body);
}

