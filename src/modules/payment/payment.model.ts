import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IPaymentDoc, IPaymentModel, PaymentStatus } from './payment.interfaces';

// Schema definition with strict TypeScript types
const paymentSchema = new mongoose.Schema<IPaymentDoc, IPaymentModel>(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      trim: true,
      unique: true,
      index: true,
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PaymentStatus),
        message: 'Invalid payment status',
      },
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    gatewayResponse: {
      type: Object,
      default: {},
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    refundData: {
      amount: {
        type: Number,
        min: [0, 'Refund amount cannot be negative'],
      },
      reason: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
      },
    },
    metadata: {
      ipAddress: {
        type: String,
        trim: true,
      },
      userAgent: {
        type: String,
        trim: true,
      },
      attempts: {
        type: Number,
        default: 0,
        min: [0, 'Attempts cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index(
  { studentId: 1, month: 1, class: 1 },
  {
    name: 'payment_lookup_index',
    background: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>('Payment', paymentSchema);

export default Payment;
