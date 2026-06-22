import { IUserRepository } from "../../../../application/ports/repositories/IUserRepository";
import { User } from "../../../../domain/entities/User";
import prisma from "../../client";

export class PrismaUserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { username } });
    if (!data) return null;
    return User.fromPrimitives(data);
  }

  async create(user: User): Promise<User> {
    const data = await prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
      },
    });
    return User.fromPrimitives(data);
  }
}
