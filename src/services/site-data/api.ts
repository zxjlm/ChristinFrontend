import {request} from 'umi';

export const websiteBasicData = async (options?: Record<string, any>) => (
  request<API.basicData>('/main/api/v2/get_website_info', {
    method: 'GET',
    ...(options || {}),
  })
)

export const projectRuntime = async () => (
  request<API.projectRuntimeData>('/main/api/v2/get_project_runtime', {
    method: 'GET',
  })
)
