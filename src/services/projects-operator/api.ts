import { request } from '@@/plugin-request/request';

export const projectsRuntime = async () =>
  request<ProjectApi.runtimeResult>('/main/api/v2/get_project_runtime', {
    method: 'GET',
  });

export const get_project_detail = async (taskId: string) =>
  request<ProjectApi.projectDetailResult>(`/main/api/v2/show_project_detail/${taskId}`, {
    method: 'GET',
  });
