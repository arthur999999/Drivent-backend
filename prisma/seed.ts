import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
  let ticketType = await prisma.ticketType.findMany();
  if (ticketType.length !== 3) {
    await prisma.ticketType.createMany({
      data: [
        { name: 'type1', price: 100, isRemote: true, includesHotel: false},
        { name: 'type2', price: 250, isRemote: false, includesHotel: false},
        { name: 'type3', price: 600, isRemote: false, includesHotel: true},
      ],
    });
  }
  ticketType = await prisma.ticketType.findMany();
  console.log({ event, ticketType });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
