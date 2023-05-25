import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';

const DEFAULT_NONCE_EXPIRATION = 30 * 60 * 1000; // 30 min
const ERROR_INVALID_VENOM_ADDRESS =
  'Invalid Venom Address: Hex address expected';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly venomService: VenomService,
  ) {}

  private newExpirationDate(expiresIn = DEFAULT_NONCE_EXPIRATION): Date {
    const currentDate = new Date();
    const expiration = new Date(currentDate.getTime() + expiresIn);
    return expiration;
  }

  private async validateHexAddress(address: string): Promise<void> {
    try {
      const addrType = await this.venomService.client.utils.get_address_type({
        address,
      });
      if (addrType.address_type !== 'Hex') {
        throw new BadRequestException(ERROR_INVALID_VENOM_ADDRESS);
      }
    } catch (error) {
      throw new BadRequestException(ERROR_INVALID_VENOM_ADDRESS);
    }
  }

  async createNonce({ address }: { address: string }) {
    await this.validateHexAddress(address);
    const authNonce = await this.prismaService.authNonce.create({
      data: {
        address: address,
        expiration: this.newExpirationDate(),
        nonce: randomUUID(),
      },
    });
    return {
      nonce: authNonce.nonce,
    };
  }
}
