import { delay, injectable } from 'vendor/tokamak';

import { Project } from '../types/project';

@injectable()
export class DashboardApi {
  public async getProjects(): Promise<Array<Project>> {
    await delay(2000);
    return Promise.resolve([{ name: 'Project A' }, { name: 'Project B' }]);
  }
}
