import { Period } from '@@/orders/dto/date-filter.dto';
import {
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  UnauthorizedException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AppUtilities {
  public static generateProductCode(product_name: string): string {
    const product_code = product_name.toLowerCase().replace(/\s/g, '_');

    return product_code;
  }

  public static generateDateRange(period: Period) {
    if (period !== Period.ALL) {
      const duration = moment.duration(period);
      const previousDuration = moment().subtract(duration);

      const result = {
        currentMonthStart: moment().startOf('month').toISOString(),
        currentMonthEnd: moment().endOf('month').toISOString(),
        currentYearStart: moment().startOf('year').toISOString(),
        currentYearEnd: moment().endOf('year').toISOString(),
        previousMonthStart: previousDuration.startOf('month').toISOString(),
        previousMonthEnd: previousDuration.endOf('month').toISOString(),
        previousYearStart: previousDuration.startOf('year').toISOString(),
        previousYearEnd: previousDuration.endOf('year').toISOString(),
      };

      return result;
    }
  }

  public static handleException(error: any): Error {
    console.error(AppUtilities.requestErrorHandler(error));

    const errorCode: string = error.code;
    const message: string = error.meta
      ? error.meta.cause
        ? error.meta.cause
        : error.meta.field_name
          ? error.meta.field_name
          : error.meta.column
            ? error.meta.table
            : error.meta.table
      : error.message;
    switch (errorCode) {
      case 'P0000':
      case 'P2003':
      case 'P2004':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        return new NotFoundException(message);
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2009':
      case 'P2010':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
      case 'P2017':
      case 'P2019':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2026':
      case 'P2027':
        return new BadRequestException(message);
      case 'P2024':
        return new RequestTimeoutException(message);
      case 'P0001':
        return new UnauthorizedException(message);
      case 'P2002':
        const msg = `Conflict Exception: '${error.meta?.target?.[0]}' already exists!`;
        return new ConflictException(error.meta?.target?.[0] ? msg : message);
      default:
        console.error(message);
        if (!!message && message.toLocaleLowerCase().includes('arg')) {
          return new BadRequestException(
            'Invalid/Unknown field was found in the data set!',
          );
        } else {
          return error;
        }
    }
  }

  public static requestErrorHandler = (response: any = {}) => {
    const {
      message: errorMessage,
      response: serverResp,
      isCancel,
      isNetwork,
      config,
    } = response;

    let message = errorMessage,
      data: any = {},
      isServerError = false;

    if (serverResp?.data) {
      isServerError = true;
      message =
        serverResp.data?.error ||
        serverResp.data?.message ||
        'Unexpected error occurred!';
      data =
        typeof serverResp.data === 'object'
          ? { ...serverResp.data }
          : { data: serverResp.data };
      delete data.message;
    } else if (isCancel) {
      message = 'Request timed out.';
    } else if (isNetwork) {
      message = 'Network not available!';
    }

    const errorData = {
      message,
      isServerError,
      ...(isServerError && {
        data: {
          ...data,
          errorMessage,
          api: {
            method: config?.method,
            url: config?.url,
            baseURL: config?.baseURL,
          },
        },
      }),
    };

    return errorData;
  };

  public static removeSensitiveData(data: any, deleteKeys: any, remove = true) {
    if (typeof data != 'object') return;
    if (!data) return;

    for (const key in data) {
      if (deleteKeys.includes(key)) {
        remove ? delete data[key] : (data[key] = '******************');
      } else {
        AppUtilities.removeSensitiveData(data[key], deleteKeys);
      }
    }
    return data;
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }
}
