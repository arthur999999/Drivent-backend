import { prisma } from "@/config";

async function findDateById(id: number) {
  return prisma.dates.findFirst({
    where: { id }
  });
}

async function findActivity(dateId: number) {
  return prisma.activities.findMany({
    where: { dateId },
    include: {
      Subscriptions: true,
      Location: true
    }
  });
}

async function findSubscriptionsByUser(userId: number) {
  return prisma.subscriptions.findMany({
    where: { userId }
  });
}

const activitiesRepository = {
  findActivity,
  findDateById,
  findSubscriptionsByUser
};

export default activitiesRepository;
