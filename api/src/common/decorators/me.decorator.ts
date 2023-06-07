import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '@prisma/client';

export const Me = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): null | Pick<Account, 'id' | 'address'> => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      address: user.address,
    };
  },
);
