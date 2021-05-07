import { request } from '@@/plugin-request/request';

export const projectsRuntime = async () =>
  request<ProjectApi.runtimeResult>('/main/api/v2/get_project_runtime', {
    method: 'GET',
  });
