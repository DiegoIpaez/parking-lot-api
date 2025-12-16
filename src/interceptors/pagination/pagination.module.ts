import { Module } from '@nestjs/common';
import { PaginationInterceptor } from './pagination.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationInterceptor,
    },
  ],
})
export class PaginationModule {}
