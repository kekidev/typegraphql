import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log("args: ", args);

  return next();
};
