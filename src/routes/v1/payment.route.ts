import express, { Router } from 'express';
import { paymentController, paymentValidation } from '../../modules/payment';
import { validate } from '../../modules/validate';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(paymentValidation.createPayment), paymentController.createPayment)
  .get(validate(paymentValidation.getPayments), paymentController.getPayments);

router.route('/:transactionId/download/receipt').get(paymentController.downloadPaymentReceipt);

router.route('/:transactionId/:type').post(paymentController.updatePayment);
router.route('/:transactionId/:type').post(paymentController.updatePayment);

export default router;
