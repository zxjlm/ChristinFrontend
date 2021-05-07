import ProDescriptions from '@ant-design/pro-descriptions';
import type { annotationType } from '@/components/SingleAnnotation';
import SingleAnnotation from '@/components/SingleAnnotation';
import { Card, Space } from 'antd';

export default ({ projectData }: { projectData: ProjectApi.projectDetailResult }) => {
  return (
    <div>
      <ProDescriptions column={2} title={projectData.s_project_name} tooltip="项目名称">
        <ProDescriptions.Item span={2} label="项目描述">
          {projectData.s_project_description || '无项目描述'}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建日期" valueType="dateTime">
          {Date.parse(projectData.create_date_time)}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新日期" valueType="dateTime">
          {Date.parse(projectData.update_date_time)}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="项目状态"
          valueEnum={{
            all: { text: '全部', status: 'Default' },
            deleted: {
              text: '已删除',
              status: 'Error',
            },
            running: {
              text: '运行中',
              status: 'Success',
            },
            exited: {
              text: '已退出',
              status: 'Processing',
            },
          }}
        >
          {projectData.status}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="项目处理进度" valueType="progress">
          100
        </ProDescriptions.Item>
        <ProDescriptions.Item label="分析数据">
          <Space direction="vertical">
            {projectData.data.map(
              (doc: { annotations: annotationType[]; text: string }, list_id: number) => (
                <Card
                  type="inner"
                  key={Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))}
                >
                  <SingleAnnotation
                    labels={projectData.labels}
                    text={doc.text}
                    list_id={list_id}
                    readOnly={true}
                  />
                </Card>
              ),
            )}
          </Space>
        </ProDescriptions.Item>
      </ProDescriptions>
    </div>
  );
};
