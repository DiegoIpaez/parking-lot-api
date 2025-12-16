import { Request } from 'express';
import { Observable, map } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { paginationFormatter } from './pagination.formatter';

interface GetResponse<T = any> {
  data: T[];
  totalRecords: number;
}

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.method !== 'GET') return next.handle();

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const showAll = req.query.showAll === 'true';

    return next.handle().pipe(
      map((result: GetResponse) => {
        if (
          !result ||
          typeof result !== 'object' ||
          !Array.isArray(result?.data) ||
          typeof result.totalRecords !== 'number'
        ) {
          throw new BadRequestException(
            'The response must be: { data: [], totalRecords: number }'
          );
        }

        return paginationFormatter({
          data: result?.data,
          page,
          limit,
          totalRecords: result?.totalRecords,
          showAll,
        });
      })
    );
  }
}
