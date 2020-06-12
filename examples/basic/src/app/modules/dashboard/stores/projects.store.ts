import { Store, StoreConfig } from '@datorama/akita';
import { injectable } from 'vendor/tokamak';

import { Project } from '../types';

export interface ProjectsState {
  projects: Array<Project>;
}

function getInitialState(): ProjectsState {
  return {
    projects: [],
  };
}

@injectable()
@StoreConfig({ name: 'projects' })
export class ProjectsStore extends Store<ProjectsState> {
  constructor() {
    super(getInitialState());
  }
}
