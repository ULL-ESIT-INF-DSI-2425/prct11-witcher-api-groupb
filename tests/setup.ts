import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
});

afterAll(async () => {
  await mongoose.disconnect();
});
