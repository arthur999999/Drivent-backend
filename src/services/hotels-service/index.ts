/* eslint-disable indent */
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { Hotel, Room } from "@prisma/client";
import bookingRepository from "@/repositories/booking-repository";

type HotelDB = (Hotel & {
  Rooms: Room[];
})[]

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function nameRoomsCapacityAndVacancies(hotels: HotelDB) {
  const response = [];
  for (const element of hotels) {
    const rooms = element.Rooms;
    
    const aux: number[] = [];
    const booking = await bookingRepository.findAllBookings();
    let  vacancies = 0;
    for(let i = 0; i < rooms.length; i++) {
      const { capacity } = rooms[i];
      
      vacancies += capacity;

      if (!(capacity in aux)) aux.push(capacity);
    }

    vacancies -= booking.length;

    const types: string[] = [];
    aux.forEach(num => {
      switch (num) {
      case 1:
        types.push("Single");
        break;
      case 2:
        types.push("Double");
        break;
      case 3:
        types.push("Triple");
        break;
      default:
        types.push("Family");
        break;
      }
    });

    const data = {
      id: element.id,
      name: element.name,
      image: element.image,
      roomTypes: types.join(", "),
      vacancies: vacancies,
      createdAt: element.createdAt,
      updatedAt: element.updatedAt,
    };

    response.push(data);
  }

  return response;
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelRepository.findHotels();

  const response = await nameRoomsCapacityAndVacancies(hotels);

  return response;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
