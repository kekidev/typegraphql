import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefix";

export const createConfirmationUrl = async (userId: number) => {
  // create randomass token
  const token = v4();

  await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); // 1 day expire

  return `http://localhost:3000/user/confirm/${token}`;
};
