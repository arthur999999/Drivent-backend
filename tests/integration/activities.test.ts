import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { createActivity, createDate, createLocation } from "../factories/activities-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /activities/:activityId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/activities/1");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.post("/activities/1").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.post("/activities/1").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      const date = await createDate();
      const location = await createLocation();
      const activity = await createActivity(date.id, location.id);

      const response = await server.post(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 404", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      const date = await createDate();
      const location = await createLocation();
      const activity = await createActivity(date.id, location.id);

      const response = await server.post(`/activities/${123}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});
