import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entitiy/User";
import { MyContext } from "../../types/MyContext";
import argon from "argon2";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await argon.verify(user.password, password);

    if (!valid) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
