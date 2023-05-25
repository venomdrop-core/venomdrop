import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Base64 } from 'js-base64';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';
import { CompleteAuthInput, CreateNonceInput } from './auth.dto';
import { generateAuthMessage } from 'src/utils/generateAuthMessage';

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

  async createNonce({ address, contractType, publicKey }: CreateNonceInput) {
    await this.validateHexAddress(address);
    const authNonce = await this.prismaService.authNonce.create({
      data: {
        address: address,
        contractType,
        publicKey,
        expiration: this.newExpirationDate(),
        nonce: randomUUID(),
      },
    });
    return {
      nonce: authNonce.nonce,
    };
  }

  async completeAuth({ nonce, signedMessage }: CompleteAuthInput) {
    const authNonce = await this.prismaService.authNonce.findUnique({
      where: {
        nonce,
      },
    });
    if (!authNonce) {
      throw new UnauthorizedException('Invalid Nonce');
    }
    const { address, publicKey, contractType } = authNonce;
    // Checking the signature
    const message = generateAuthMessage(address, nonce);
    const { isValid: isSignatureValid } =
      await this.venomService.verifySignature({
        publicKey: publicKey,
        signature: signedMessage,
        dataHash: Base64.encode(message),
      });
    if (!isSignatureValid) {
      throw new UnauthorizedException('Invalid Signature');
    }
    // Checking if the PublicKey matches the Account Address
    const addressMatchesPublicKey =
      await this.venomService.verifyWalletAddressMatchesPublicKey({
        address,
        contractType,
        publicKey,
      });
    if (!addressMatchesPublicKey) {
      throw new UnauthorizedException('Address<>PublicKey mismatch');
    }
    console.log({
      isSignatureValid,
      addressMatchesPublicKey,
    });
    return 'opa';
  }
}
