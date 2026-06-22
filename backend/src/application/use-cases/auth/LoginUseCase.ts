import { IUserRepository } from "../../ports/repositories/IUserRepository";
import { IJwtService } from "../../ports/services/IJwtService";
import { IEncryptionService } from "../../ports/services/IEncryptionService";
import { LoginDto } from "../../dto/LoginDto";
import { AuthResponseDto } from "../../dto/AuthResponseDto";
import { UnauthorizedError } from "../../../domain/exceptions/DomainError";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService,
    private encryptionService: IEncryptionService,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await this.encryptionService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id!,
        username: user.username,
      },
    };
  }
}
