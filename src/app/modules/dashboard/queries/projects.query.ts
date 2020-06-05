import { Query } from '@datorama/akita';
import { injectable } from 'vendor/tokamak';

import { DashboardApi } from '../api';
import { ProjectsState, ProjectsStore } from '../stores';
import { Project } from '../types';

@injectable()
export class ProjectsQuery extends Query<ProjectsState> {
  constructor(protected readonly store: ProjectsStore, private readonly api: DashboardApi) {
    super(store);
  }

  public async loadProjects(): Promise<Array<Project>> {
    this.store.setLoading(true);
    const projects = await this.api.getProjects();
    this.store.update({ projects });
    this.store.setLoading(false);
    return projects;
  }
}
