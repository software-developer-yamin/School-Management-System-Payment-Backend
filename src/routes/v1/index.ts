import express, { Router } from 'express';
import paymentRoute from './payment.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/payments',
    route: paymentRoute,
  },
];



defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
