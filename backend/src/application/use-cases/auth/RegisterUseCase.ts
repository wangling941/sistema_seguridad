import { IUserRepository } from "../../ports/repositories/IUserRepository";
import { IEncryptionService } from "../../ports/services/IEncryptionService";
import { CreateUserDto } from "../../dto/CreateUserDto";
import { User } from "../../../domain/entities/User";
import { ConflictError } from "../../../domain/exceptions/DomainError";

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private encryptionService: IEncryptionService,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Verificar si el usuario ya existe
    const existing = await this.userRepository.findByUsername(dto.username);
    if (existing) {
      throw new ConflictError("El nombre de usuario ya está en uso");
    }

    // Hashear la contraseña
    const hashedPassword = await this.encryptionService.hash(dto.password);

    // Crear entidad User (la validación se hará en la entidad)
    const user = new User(undefined, dto.username, hashedPassword);

    // Guardar en la base de datos
    return this.userRepository.create(user);
  }
}
