/** @module @tokamakjs/react */

export {
  onModuleInit,
  onModuleDidInit,
  ModuleRef,
  inject,
  Module,
  Token,
} from '@tokamakjs/injection';

export {
  Controller,
  effect,
  HookService,
  Injectable,
  ref,
  state,
  SubApp,
  onDidMount,
  onDidRender,
  memo,
} from './decorators';

export { TokamakApp } from './tokamak-app';

export {
  Link,
  createRoute,
  createRedirection,
  Outlet,
  includeRoutes,
  useNavigate,
  useLocation,
  useParams,
} from './routing';

export { useController, useAppContext, useResolve, useResolveSync } from './hooks';

export { RouterModule } from './modules';

export { DiContainerProvider } from './components';
