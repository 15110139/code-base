import { ResponseApiInterface } from "@internal/shared/api-interface/base-api-interface";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	RequestTimeoutException,
} from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ResponseApiInterceptor<T>
	implements NestInterceptor<T, ResponseApiInterface<T>> {
	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<ResponseApiInterface<T>> {
		return next.handle().pipe(
			map(
				data => ({ data, systemCode: SYSTEM_CODE.SUCCESS }),
				catchError(err => {
					if (err instanceof TimeoutError) {
						return throwError(new RequestTimeoutException());
					}
					return throwError(err);
				}),
			),
		);
	}
}
