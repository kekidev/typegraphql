import { Arg, Mutation, Resolver } from "type-graphql";
import { redis } from "../../redis";
import { User } from "../../entitiy/User";
import { confirmUserPrefix } from "../constants/redisPrefix";

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    // get users token
    const userId = await redis.get(confirmUserPrefix + token);

    // if user already confirmed or token dosen't exists return false
    if (!userId) {
      return false;
    }

    // update confirmed to true
    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    // delete token to prevant re-confirm
    await redis.del(token);

    return true;
  }
}
