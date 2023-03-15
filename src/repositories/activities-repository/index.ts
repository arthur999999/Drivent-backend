import { prisma } from "@/config";

async function findActivity(dateId: number) {
  return prisma.activities.findMany({
    where: { dateId },
    include: {
      Subscriptions: true,
    }
  });
}

const activitiesRepository = {
  findActivity
};

export default activitiesRepository;
