import { StepsForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Divider, message, Switch, Table } from 'antd';
import { buildSandboxViaStructData, getSqlData } from '@/services/projects-operator/api';
import { useState } from 'react';
import type { ProjectApi } from '@/services/projects-operator/typing';
import PollStopCard from '@/components/PollStopCard';
import { openNotification } from '@/components/InputStepForms/NormalStepForm';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const [projectInfo, setProjectInfo] = useState({
    projectName: 'undefined',
    projectDescription: '',
  });
  const [needEmail, setNeedEmail] = useState(true);
  const [responseData, setResponseData] = useState<ProjectApi.getSqlDataResult>({
    code: 0,
    data: [{ columns: [{ title: '', dataIndex: '' }], data: [], table_name: '' }],
    msg: '',
  });
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [startPolling, setStartPolling] = useState(false);
  const [formHash, setFormHash] = useState('');

  const stopOneFinish = async (formData: any) => {
    getSqlData(formData).then((response) => {
      setProjectInfo({
        projectName: formData['project-name'],
        projectDescription: formData['project-description'],
      });
      setResponseData(response);
    });
    return true;
  };

  const stopTwoFinish = async () => {
    const pre_nodes: any = responseData.data.map((item) => ({
      nodes: [
        item.data.map((node: any) => ({
          name: node.s_name,
          type: item.table_name.replace('tb_', '').toUpperCase(),
          ...node,
        })),
      ],
      relationship: [],
    }));
    let result_nodes: any = [];
    pre_nodes.forEach((item: { nodes: any }) => {
      result_nodes = result_nodes.concat(item.nodes[0]);
    });
    const postData: ProjectApi.buildSandboxViaStructDataBody = {
      projectName: projectInfo.projectName,
      projectDescription: projectInfo.projectDescription,
      result: { nodes: result_nodes, relationships: [] },
      needEmail,
    };
    if (formHash !== JSON.stringify(postData)) {
      buildSandboxViaStructData(postData).then((response) => {
        setTaskId(response.task_id);
        setFormHash(JSON.stringify(postData));
      });
    } else {
      openNotification('表单未曾发生改变, 默认不进行提交');
      setStartPolling(!startPolling);
    }
    return true;
  };

  return (
    <StepsForm
      onFinish={async (values) => {
        console.log(values);
        await waitTime(1000);
        message.success('提交成功');
      }}
      formProps={{
        validateMessages: {
          required: '此项为必填项',
        },
      }}
    >
      <StepsForm.StepForm name="base" title="数据录入" onFinish={stopOneFinish}>
        <ProFormText
          name="project-name"
          label="项目名称"
          width="md"
          tooltip="最长为 24 位，用于标定的唯一 id"
          placeholder="请输入项目名称"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="project-description"
          label="项目描述"
          width="lg"
          placeholder="请输入项目描述(250字以内)"
          initialValue={'无'}
        />
        <ProFormText
          name="db-host"
          label="ip地址"
          width="md"
          placeholder="请输入数据库地址"
          rules={[{ required: true }]}
          initialValue={'localhost'}
        />
        <ProFormText
          name="db-port"
          label="端口"
          width="md"
          placeholder="请输入数据库端口"
          rules={[{ required: true }]}
          initialValue={3306}
        />
        <ProFormText
          name="db-username"
          label="用户名"
          width="md"
          placeholder="请输入数据库用户名"
          rules={[{ required: true }]}
          initialValue={'root'}
        />
        <ProFormText.Password
          name="db-password"
          label="密码"
          width="md"
          placeholder="请输入数据库密码"
          rules={[{ required: true }]}
          initialValue={'root'}
        />
        <ProFormText
          name="db-database"
          label="数据库名"
          width="md"
          placeholder="请输入数据库名称"
          rules={[{ required: true }]}
          style={{ marginBottom: '20px' }}
          initialValue={'Christin'}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm<{
        checkbox: string;
      }>
        name="checkbox"
        title="审核表单"
        onFinish={stopTwoFinish}
      >
        {responseData.data.map((item) => (
          <div key={Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))}>
            <h2>{item.table_name}</h2>
            <Table columns={item.columns} dataSource={item.data} pagination={false} />
            <Divider />
          </div>
        ))}
        <div style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '20px' }}>
          <Switch
            checkedChildren={'使用邮件通知'}
            unCheckedChildren={'不需要邮件'}
            defaultChecked={true}
            onChange={(checked) => setNeedEmail(checked)}
          />
        </div>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="time" title="构建图数据库">
        <PollStopCard taskId={taskId} startPolling={startPolling} />
      </StepsForm.StepForm>
    </StepsForm>
  );
};
