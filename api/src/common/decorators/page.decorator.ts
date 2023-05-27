import { applyDecorators } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export interface ApiPageOptions {
  take?: number;
  skip?: number;
}

export const ApiPage = (): ParameterDecorator => {
  return createParamDecorator(
    (data: unknown, context: ExecutionContext): ApiPageOptions => {
      const request = context.switchToHttp().getRequest();
      const { limit, skip } = request.query;

      const pageOptions: ApiPageOptions = {
        take: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      };

      return pageOptions;
    },
  );
};

export function ApiQueryPage() {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
    }),
    ApiQuery({
      name: 'skip',
      type: 'number',
      required: false,
    }),
  );
}
