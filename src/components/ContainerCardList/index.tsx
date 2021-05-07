import { Progress, Tag } from 'antd';
import { projectsRuntime } from '@/services/projects-operator/api';
import { useEffect, useState } from 'react';
import ContainerCard from '@/components/ContainerCard/index';

export default () => {
  const [projectsRuntimeInfo, setProjectsRuntimeInfo] = useState<ProjectApi.runtimeResult>({
    creating: [],
    deleted: [],
    exited: [],
    running: [],
  });

  useEffect(() => {
    projectsRuntime().then((result) => setProjectsRuntimeInfo(result));
    return () => {};
  }, []);

  return (
    <ContainerCard
      runtimeData={projectsRuntimeInfo.deleted.map((item) => ({
        title: item.s_project_name,
        subTitle: <Tag color="#5BD8A6">{item.s_project_description}</Tag>,
        type: item.status,
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        content: (
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                width: 200,
              }}
            >
              <div>子任务进度:</div>
              <Progress percent={100} />
            </div>
            <div>
              <div>创建日期:</div>
              <div style={{ color: item.badge_color }}>
                {new Date(Date.parse(item.create_date_time)).toLocaleString()}
              </div>
            </div>
          </div>
        ),
        actions: [<a>邀请</a>],
      }))}
    />
  );
};
