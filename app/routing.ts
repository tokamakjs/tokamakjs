import { AuthModule } from './modules/auth/Auth.module';
import { DashboardModule } from './modules/dashboard/Dashboard.module';
import { Root } from './routes/Root';

export const routing = [
  {
    path: '',
    route: Root,
    children: [
      { path: '/login', module: AuthModule },
      { path: '/', module: DashboardModule },
    ],
  },
];
