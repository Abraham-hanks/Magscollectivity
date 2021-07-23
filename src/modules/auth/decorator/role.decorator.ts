import { SetMetadata } from '@nestjs/common';
import { SCOPES } from 'src/common/auth/scopes';

export const Role = (scope: SCOPES) => SetMetadata('scope', scope);
