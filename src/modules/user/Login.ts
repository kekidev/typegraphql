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

    // if user dosen't exists on db return null
    if (!user) {
      return null;
    }

    // compare between hashed original password and hahsed input password
    const valid = await argon.verify(user.password, password);

    if (!valid) {
      return null;
    }

    // if user dosen't confirmed email return null
    if (!user.confirmed) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
