import { request } from '@@/plugin-request/request';

export const projectsRuntime = async () =>
  request<ProjectApi.runtimeResult>('/main/api/v2/get_project_runtime', {
    method: 'GET',
  });

export const get_project_detail = async (taskId: string) =>
  request<ProjectApi.projectDetailResult>(`/main/api/v2/show_project_detail/${taskId}`, {
    method: 'GET',
  });

export const project_deleted = async (taskId: string) =>
  request<ProjectApi.normalOperatorResult>(`/main/api/v2/delete_project/${taskId}`, {
    method: 'DELETE',
  });

export const project_start = async (taskId: string) =>
  request<ProjectApi.normalOperatorResult>(`/main/api/v2/start_project/${taskId}`, {
    method: 'GET',
  });

export const project_exited = async (taskId: string) =>
  request<ProjectApi.normalOperatorResult>(`/main/api/v2/exited_project/${taskId}`, {
    method: 'PUT',
  });
