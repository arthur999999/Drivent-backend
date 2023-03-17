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
  findAllLocations
};

export default activitiesRepository;
