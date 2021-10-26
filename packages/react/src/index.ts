export {
  onModuleInit,
  onModuleDidInit,
  ModuleRef,
  inject,
  Module,
  Token,
  DiContainer,
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

export { useController, useAppContext, useResolve, useResolveSync, useDiContainer } from './hooks';

export { RouterModule } from './modules';

export { DiContainerProvider } from './components';

// The app needs this re-export of React. Otherwise, it complaints about
// this: https://reactjs.org/warnings/invalid-hook-call-warning.html
import React from 'react';
export { React };
// Export hooks directly for convenience
export {
  useState,
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
