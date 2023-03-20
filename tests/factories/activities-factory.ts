import { prisma } from "@/config";
import faker from "@faker-js/faker";

export function createActivity(dateId: number, locationId: number) {
  return prisma.activities.create({
    data: {
      name: faker.random.words(3),
      locationId: locationId,
      dateId: dateId,
      startsAt: "10:00",
      endsAt: "11:00",
      duration: 1,
      vacancies: 0
    }
  });
}

export function createDate() {
  return prisma.dates.create({
    data: {
      weekday: "Sexta", mounth: "05", day: "04"
    }
  });
}

export function createLocation() {
  return prisma.locations.create({
    data: {
      name: "Auditório A" 
    }
  });
}
