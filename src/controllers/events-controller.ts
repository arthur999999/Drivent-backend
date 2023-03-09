import eventsService from "@/services/events-service";
import client from "@/utils/redis";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getDefaultEvent(_req: Request, res: Response) {
  try {
    const  realEvent = await client.get("event");
    if(realEvent) {
      return res.status(httpStatus.OK).send(JSON.parse( realEvent ));
    }else{
      const event = await eventsService.getFirstEvent();
      await client.set("event", JSON.stringify(event));
      return res.status(httpStatus.OK).send(event);
    }
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
