import { action, observable } from 'mobx';
import { injectable } from 'vendor/tokamak';

import { DashboardApi } from '../api';
import { Project } from '../types/project';

@injectable()
export class ProjectsStore {
  @observable public isLoading = false;
  @observable public projects = [] as Array<Project>;

  constructor(private readonly dashboardApi: DashboardApi) {}

  @action.bound
  public async loadProjects(): Promise<Array<Project>> {
    this.isLoading = true;
    this.projects = await this.dashboardApi.getProjects();
    this.isLoading = false;
    return this.projects;
  }
}
