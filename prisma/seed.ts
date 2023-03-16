import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import faker from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Unde vero sit est dicta.',
        logoImageUrl: 'http://loremflickr.com/640/480',
        backgroundImageUrl: 'http://loremflickr.com/640/480',
        endsAt: dayjs().add(21, 'days').toDate(),
        startsAt: dayjs().toDate(),
      },
    });
  }
  let ticketType = await prisma.ticketType.findMany();
  if (ticketType.length !== 3) {
    await prisma.ticketType.createMany({
      data: [
        { name: 'Ingresso Remoto', price: 100, isRemote: true, includesHotel: false },
        { name: 'Ingresso Presencial sem hotel', price: 250, isRemote: false, includesHotel: false },
        { name: 'Ingresso presencial com hotel', price: 600, isRemote: false, includesHotel: true },
      ],
    });
  }
  ticketType = await prisma.ticketType.findMany();
  let hotels = await prisma.hotel.findMany();
  if (hotels.length !== 3) {
    await prisma.hotel.createMany({
      data: [
        { name: "Hotel paraiso", image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/116425852.jpg?k=0efce6ef945e9693a2ff36b0352cd057afbe8ab4c1a4aed0885f55f914170da9&o=&hp=1" },
        { name: "Hotel lua nova", image: "https://cf.bstatic.com/xdata/images/hotel/max500/265781995.jpg?k=e106d79f2d36a458d055a38bc0bc1485c1c7ab4ccea68eb0e7febc4efa623c16&o=&hp=1" },
        { name: "Hotel conforto", image: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg" },
      ],
    });
  }
  hotels = await prisma.hotel.findMany();
  hotels.forEach(async (h) => {
    for (let i = 0; i < 16; i++) {
      await prisma.room.create({
        data: {
          name: faker.random.numeric(3),
          capacity: Math.floor(Math.random() * 3) + 1,
          hotelId: h.id
        }
      })
    }
  })
  const room = await prisma.room.findMany();

  let dates = await prisma.dates.findMany();
  if(dates.length < 3) {
    await prisma.dates.createMany({
      data: [
        { weekday: "Sexta", mounth: "05", day: "04"},
        { weekday: "Sábado", mounth: "05", day: "05"},
        { weekday: "Domingo", mounth: "05", day: "06"},
      ]
    })
  }

  let locations = await prisma.locations.findMany();
  if (locations.length < 3) {
    await prisma.locations.createMany({
      data: [
        { name: 'Auditório A' },
        { name: 'Auditório B' },
        { name: 'Espaço Multimídia'}
      ]
    })
  }

  dates = await prisma.dates.findMany();
  locations = await prisma.locations.findMany();

  await prisma.subscriptions.deleteMany()
  await prisma.activities.deleteMany();

  const activities = await prisma.activities.createMany({
    data: [
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[0].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[0].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[0].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[0].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[0].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[0].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[1].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[1].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[1].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[1].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[1].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[1].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[2].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[0].id, dateId: dates[2].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[2].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[1].id, dateId: dates[2].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[2].id, startsAt: "09:00", endsAt: "11:00", duration: 2, vacancies: 10 },
      { name: faker.random.words(3), locationId: locations[2].id, dateId: dates[2].id, startsAt: "13:00", endsAt: "15:00", duration: 2, vacancies: 10 }
    ]
  })

  console.log({ event, ticketType, hotels, room, dates, locations, activities });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
