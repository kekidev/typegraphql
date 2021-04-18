import { User } from "../../entitiy/User";
import { redis } from "../../redis";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { forgotPasswordPrefix } from "../constants/redisPrefix";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import argon from "argon2";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(forgotPasswordPrefix + token);

    user.password = await argon.hash(password);

    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
