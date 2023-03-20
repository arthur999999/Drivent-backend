import { init } from "@/app";
import activitiesService from "@/services/activities-service";
import faker from "@faker-js/faker";
import { createActivity, createDate, createLocation } from "../factories/activities-factory";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});
  
beforeEach(async () => {
  await cleanDb();
});

describe("get activity by id", () => {
  it("should return a activity", async () => {
    const date = await createDate();
    const location = await createLocation();
    const activity = await createActivity( date.id, location.id);
    const response = await activitiesService.getActivityById(activity.id);

    expect(response).toEqual(activity);
  });
  it("should return a not found error", async () => {
    const date = await createDate();
    const location = await createLocation();
    async function getActivity() {
      try {
        const activityFound = await activitiesService.getActivityById(faker.datatype.number());
        return activityFound;
      } catch (error) {
        return error;
      }
    }
    const response = await getActivity();
    expect(response).toEqual({
      name: "NotFoundError",
      message: "No result for this search!" });
  });
});
