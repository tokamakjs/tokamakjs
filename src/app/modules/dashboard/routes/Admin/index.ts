import { route, useGuards } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';

import { IsAdminGuard } from '../../guards';
import { AdminView } from './Admin.view';

@route({ view: AdminView })
@useGuards([AuthGuard, IsAdminGuard])
export class Admin {}
