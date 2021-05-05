import { request } from 'umi';
import { MyAPI } from '@/services/site-data/typings';

export const websiteBasicData = async (options?: Record<string, any>) =>
  request<MyAPI.basicData>('/main/api/v2/get_website_info', {
    method: 'GET',
    ...(options || {}),
  });

export const projectRuntime = async () =>
  request<MyAPI.projectRuntimeData>('/main/api/v2/get_project_runtime', {
    method: 'GET',
  });

export const knowledgeExtract = async (body: MyAPI.rawKnowledgeMessageParams) =>
  request<MyAPI.rawKnowledgeMessageResults>('main/api/v2/extractKnowledge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });

export const startBuildSandbox = async (body: MyAPI.startBuildSandbox) =>
  request<MyAPI.startBuildSandboxResult>('main/api/v2/build_sandbox', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });

export const buildingPolling = async (task_id: string) =>
  request<MyAPI.buildingPollingResult>(`/main/api/v2/status/${task_id}`, {
    method: 'GET',
  });
