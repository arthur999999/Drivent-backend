import { cannotBookingError, notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import tikectRepository from "@/repositories/ticket-repository";

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

async function formatGetResponse(data: any[]) {
  const res = [];
  
  for (const act of data) {
    res.push({
      id: act.id,
      name: act.name,
      location: act.Location.name,
      startsAt: act.startsAt,
      endsAt: act.endsAt,
      duration: act.duration,
      vacancies: (act.vacancies - act.Subscriptions.length),
      subscribed: false
    });
  }

  return res;
}

async function getActivities(userId: number, dateId: number) {
  await validateEnrollmentAndTicket(userId);
  await validateDateId(dateId);

  const activities = await activitiesRepository.findActivity(dateId);
  // const subscriptions = await activitiesRepository.findSubscriptionsByUser(userId);

  const response = await formatGetResponse(activities);

  return response;
}

const activitiesService = {
  getActivities
};

export default activitiesService;
