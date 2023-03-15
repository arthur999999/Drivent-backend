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

async function getActivities(userId: number, dateId: number) {
  await validateEnrollmentAndTicket(userId);

  if (!dateId) throw notFoundError();
  const activities = await activitiesRepository.findActivity(dateId);
  
  return activities;
}

const activitiesService = {
  getActivities
};

export default activitiesService;
