import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { genRandomXters } from 'src/common/utils/util';
import { TokenModel as Token } from '../models/token.model';
import { RegenerateToken, TokenTypes, TOKEN_REPOSITORY, ValidateToken } from '../constants';
import { CreateTokenDto } from '../dto/token/create-token.dto';
import { ERROR_MESSAGES } from 'src/common/utils/error-messages';
import { DefaultQueryAttributeExclude } from 'src/common/constants';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { configService } from 'src/common/config/config.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject(TOKEN_REPOSITORY) private readonly tokenRepo: typeof Token,
  ) { }

  async create(newToken: CreateTokenDto, transactionHost): Promise<Token> {
    newToken.expires_at = this.getExpiresIn(newToken.valid_for);

    return this.tokenRepo.create(newToken, transactionHost);
  }

  async findOne(params, throwError = true): Promise<Token> {
    const token = await this.tokenRepo.findOne({
      where: params,
      attributes: {
        exclude: DefaultQueryAttributeExclude
      }
    });

    if (!token && throwError)
      throw new BadRequestException(ERROR_MESSAGES.TokenNotFound);

    return token;
  }

  async findAuthTokensAndDelete(id: number): Promise<number> {
    const tokens = await this.tokenRepo.destroy({
      where: {
        auth_id: id,
        type: TokenTypes.auth
      }
    })

    return tokens;
  }

  async validateToken(tokenObj: ValidateToken, transactionHost): Promise<boolean> {

    const token = await this.findOne(tokenObj);

    if (this.isValid(token))
      await token.destroy(transactionHost);

    return true;
  };

  async regenerate(tokenObj: RegenerateToken): Promise<Token> {
    const token = await this.findOne(tokenObj);

    if (token) {
      if (token.is_verified)
        throw new BadRequestException(ERROR_MESSAGES.TokenAlreadyVerified);

      token.expires_at = this.getExpiresIn(token.valid_for);
      token.value = genRandomXters(token.no_of_xters, false);

      return token.save();
    }
    throw new BadRequestException(ERROR_MESSAGES.TokenNotFound);
  };

  // valid_for is in minutes, convert to milliseconds below;
  private getExpiresIn(validFor: number): Date {
    return new Date(new Date().getTime() + (1000 * 1000 * validFor));
  }

  private isValid(token: Token) {
    if (token && token.is_valid) {
      if (token.is_verified)
        throw new BadRequestException(ERROR_MESSAGES.TokenAlreadyVerified);

      return true;
    }
    return false;
  };


  // ENCRYPTION
  async encryptText(textToEncrypt: string): Promise<any> {

    const iv = randomBytes(16);
    const password = 'Password used to generate key';

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    // const textToEncrypt = 'Nest';
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    // const decipher = createDecipheriv('aes-256-ctr', key, iv);
    // const decryptedText = Buffer.concat([
    //   decipher.update(encryptedText),
    //   decipher.final(),
    // ]);

    // const key = await this.getEncryptionKey();
    // const cipher = createCipheriv('aes-256-ctr', key, this.getIV());

    // const encryptedText = Buffer.concat([
    //   cipher.update(textToEncrypt),
    //   cipher.final(),
    // ])


    console.log('encryptedText: ' + encryptedText);

    // console.log('decryptedText: ' + decryptedText);

    return encryptedText;
  }

  async decryptText(encryptedText: Buffer | any): Promise<any> {

    const key = await this.getEncryptionKey();

    const decipher = createDecipheriv('aes-256-ctr', key, this.getIV());
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    console.log('decryptedText: ' + decryptedText);

    return encryptedText;
  }

  private async getEncryptionKey(): Promise<Buffer> {
    const { PASSWORD, SALT } = configService.getEncryptionObj();

    return (await promisify(scrypt)(PASSWORD, SALT, 32)) as Buffer;
  }

  private getIV() {
    return randomBytes(16);
  }

}
