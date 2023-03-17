import { cannotBookingError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";
import { Subscriptions } from "@prisma/client";

type Activity = {
  id: number;
  name: string;
  location: string;
  startsAt: string;
  endsAt: string;
  duration: string;
  vacancies: number;
  subscribed: boolean;
}

async function validateEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookingError();
  }

  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) {
    throw cannotBookingError();
  }
}

async function validateDateId(dateId: number) {
  const date = await activitiesRepository.findDateById(dateId);

  if (!date) throw notFoundError();
}

function formatGetResponse(data: any[]) {
  const res = [];
  
  for (const act of data) {
    res.push({
      id: act.id,
      name: act.name,
      startsAt: act.startsAt,
      endsAt: act.endsAt,
      duration: act.duration,
      vacancies: (act.vacancies - act.Subscriptions.length),
      subscribed: false
    });
  }

  return res;
}

function checkSubscriptions(subscriptions: Subscriptions[], activities: Activity[]) {
  for (const sub of subscriptions) {
    for (const i in activities) {
      if (sub.activityId === activities[i].id) {
        activities[i].subscribed = true;
      }
    }
  }

  return activities;
}

async function getActivities(userId: number, dateId: number) {
  await validateEnrollmentAndTicket(userId);
  await validateDateId(dateId);

  const locations = await activitiesRepository.findAllLocations();

  const activities = [];
  for (const loc of locations) {
    const aux = await activitiesRepository.findActivity(dateId, loc.id);
    const response = formatGetResponse(aux) as Activity[];

    activities.push({
      name: loc.name,
      activities: response
    });
  }

  const subscriptions = await activitiesRepository.findSubscriptionsByUser(userId);

  if (subscriptions.length !== 0) {
    for(const loc of activities) {
      checkSubscriptions(subscriptions, loc.activities);
    }
  }

  return activities;
}

async function getDates(userId: number) {
  await validateEnrollmentAndTicket(userId);

  const dates = await activitiesRepository.findAllDates();

  if (dates.length === 0) throw notFoundError();

  return dates;
}

const activitiesService = {
  getActivities,
  getDates
};

export default activitiesService;
