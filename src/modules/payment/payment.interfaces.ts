import { Model, Document } from 'mongoose';
import { IQueryResult } from '../paginate/paginate';

// Enums
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Interfaces
export interface IRefundData {
  amount: number;
  reason: string;
  date: Date;
}

export interface IMetadata {
  ipAddress?: string;
  userAgent?: string;
  attempts: number;
}

export interface IGatewayResponse {
  [key: string]: any;
}

export interface IPayment {
  studentId: string;
  class: string;
  month: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;
  paymentDate: Date;
  gatewayResponse: IGatewayResponse;
  receiptUrl?: string;
  refundData?: IRefundData;
  metadata?: IMetadata;
}

export interface IPaymentDoc extends IPayment, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentModel extends Model<IPaymentDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<IQueryResult<IPaymentDoc>>;
}
