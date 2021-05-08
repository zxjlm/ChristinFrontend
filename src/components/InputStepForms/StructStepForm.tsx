import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  return (
    <ProCard>
      <StepsForm<{
        name: string;
      }>
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
        <StepsForm.StepForm<{
          name: string;
        }>
          name="base"
          title="创建实验"
          onFinish={async ({ name }) => {
            console.log(name);
            await waitTime(2000);
            return true;
          }}
        >
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
          />
          <ProFormText
            name="db-port"
            label="端口"
            width="md"
            placeholder="请输入数据库端口"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="db-username"
            label="用户名"
            width="md"
            placeholder="请输入数据库用户名"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="db-password"
            label="密码"
            width="md"
            placeholder="请输入数据库密码"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="db-database"
            label="数据库名"
            width="md"
            placeholder="请输入数据库名称"
            rules={[{ required: true }]}
            style={{ marginBottom: '20px' }}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          checkbox: string;
        }>
          name="checkbox"
          title="设置参数"
        >
          <ProFormCheckbox.Group
            name="checkbox"
            label="迁移类型"
            width="lg"
            options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
          />
          <ProForm.Group>
            <ProFormText name="dbname" label="业务 DB 用户名" />
            <ProFormDatePicker name="datetime" label="记录保存时间" width="sm" />
            <ProFormCheckbox.Group
              name="checkbox"
              label="迁移类型"
              options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
            />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="发布实验">
          <ProFormCheckbox.Group
            name="checkbox"
            label="部署单元"
            rules={[
              {
                required: true,
              },
            ]}
            options={['部署单元1', '部署单元2', '部署单元3']}
          />
          <ProFormSelect
            label="部署分组策略"
            name="remark"
            rules={[
              {
                required: true,
              },
            ]}
            initialValue="1"
            options={[
              {
                value: '1',
                label: '策略一',
              },
              { value: '2', label: '策略二' },
            ]}
          />
          <ProFormSelect
            label="Pod 调度策略"
            name="remark2"
            initialValue="2"
            options={[
              {
                value: '1',
                label: '策略一',
              },
              { value: '2', label: '策略二' },
            ]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
