import { prisma } from "@/config";

async function findDateById(id: number) {
  return prisma.dates.findFirst({
    where: { id }
  });
}

async function findActivity(dateId: number, locationId: number) {
  return prisma.activities.findMany({
    where: { dateId, locationId },
    include: {
      Subscriptions: true,
    }
  });
}

async function findSubscriptionsByUser(userId: number) {
  return prisma.subscriptions.findMany({
    where: { userId }
  });
}

async function findActivityByUser(userId: number) {
  return prisma.subscriptions.findMany({
    where: { userId },
    include: {
      activity: true
    }
  });
}

async function findActivityById(activityId: number) {
  return prisma.activities.findUnique({
    where: {
      id: activityId
    }
  });
}

async function createSubscription(userId: number, acitivityId: number) {
  return prisma.subscriptions.create({
    data: {
      activityId: acitivityId,
      userId: userId
    }
  });
}

async function removeVacancie(acitivityId: number, vacancies: number) {
  return prisma.activities.update({
    where: {
      id: acitivityId
    },
    data: {
      vacancies: vacancies - 1
    }
  });
}

async function findAllDates() {
  return prisma.dates.findMany();
}

async function findAllLocations() {
  return prisma.locations.findMany();
}

const activitiesRepository = {
  findActivity,
  findDateById,
  findSubscriptionsByUser,
  findAllDates,
  findAllLocations,
  findActivityByUser,
  findActivityById,
  createSubscription,
  removeVacancie
};

export default activitiesRepository;
