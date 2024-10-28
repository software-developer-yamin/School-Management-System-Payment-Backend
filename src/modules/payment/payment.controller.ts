import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as paymentService from './payment.service';
import { pick } from '../utils';
import { IPaginateOptions } from '../paginate/paginate';
import { PaymentStatus } from './payment.interfaces';
import config from '../../config/config';

export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.createPayment(req.body);
  res.status(httpStatus.CREATED).send(payment);
});

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, []);
  const options: IPaginateOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'search', 'searchFields']);
  const result = await paymentService.queryPayments(filter, {
    ...options,
  });
  res.send(result);
});

export const updatePayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string' && req.params['type'] === 'success') {
    await paymentService.updatePaymentByTransactionId(req.params['transactionId'], {
      status: PaymentStatus.SUCCESS,
      gatewayResponse: req.body,
      metadata: {
        attempts: 1,
        ipAddress: req.ip ?? '',
        userAgent: req.headers['user-agent'] ?? '',
      },
    });
    res.redirect(`${config.clientUrl}/site/payment/${req.params['transactionId']}/${req.params['type']}`);
  }
  if (typeof req.params['transactionId'] === 'string' && req.params['type'] === 'failed') {
    await paymentService.updatePaymentByTransactionId(req.params['transactionId'], {
      status: PaymentStatus.FAILED,
      gatewayResponse: req.body,
      metadata: {
        attempts: 1,
        ipAddress: req.ip ?? '',
        userAgent: req.headers['user-agent'] ?? '',
      },
    });
    res.redirect(`${config.clientUrl}/site/payment/${req.params['transactionId']}/${req.params['type']}`);
  }
});

export const downloadPaymentReceipt = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['transactionId'] === 'string') {
    const pdfStream = await paymentService.createPdfById(req.params['transactionId']);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payments-${req.params['transactionId']}.pdf`);

    pdfStream.pipe(res);
  }
});
