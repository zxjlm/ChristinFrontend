import { message, notification, Switch } from 'antd';
import {
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
  StepsForm,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { waitTime } from '@/utils/useful';
import { knowledgeExtract, startBuildSandbox } from '@/services/site-data/api';
import type { labelType } from '@/components/SingleAnnotation';
import AnnotationCard from '@/components/AnnotationCard';
import { useModel } from '@@/plugin-model/useModel';
import { useState } from 'react';
import PollStopCard from '@/components/PollStopCard';

const openNotification = (msg: string) => {
  const args = {
    message: 'Warning',
    description: msg,
    duration: 0,
  };
  notification.open(args);
};

export default () => {
  const [labels, setLabels] = useState<labelType[]>([]);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [needEmail, setNeedEmail] = useState(true);
  const [projectInfo, setProjectInfo] = useState({
    projectName: 'undefined',
    projectDescription: '',
  });
  const [formHash, setFormHash] = useState('');
  const [startPolling, setStartPolling] = useState(false);

  const { nerDocs, setNerDocs } = useModel('nerDocs', (model) => ({
    nerDocs: model.nerDocs,
    setNerDocs: model.setNerDocs,
  }));

  const stopOneFinish = async (formData: any) => {
    knowledgeExtract(formData).then((response) => {
      setProjectInfo({
        projectName: formData['project-name'],
        projectDescription: formData['project-description'],
      });
      setNerDocs(response.nerDocs);
      setLabels(response.labels);
    });
    return true;
  };

  const stopTwoFinish = async () => {
    const postData = { ...projectInfo, needEmail, data: nerDocs };
    if (formHash !== JSON.stringify(postData)) {
      startBuildSandbox(postData).then((response) => {
        if (response.code === 200) {
          setTaskId(response.task_id);
        }
      });
      setFormHash(JSON.stringify(postData));
    } else {
      openNotification('表单未曾发生改变, 默认不进行提交');
      setStartPolling(!startPolling);
    }
    return true;
  };

  return (
    <StepsForm
      onFinish={async () => {
        await waitTime(1000);
        message.success('提交成功');
      }}
      formProps={{
        validateMessages: {
          required: '此项为必填项',
        },
      }}
    >
      <StepsForm.StepForm name="dataInput" title="数据录入" onFinish={stopOneFinish}>
        <div style={{ marginLeft: '30px' }}>
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
        </div>
        <ProCard
          tabs={{
            type: 'card',
          }}
        >
          <ProCard.TabPane key="tab1" tab="手动输入">
            <ProFormTextArea
              name="message"
              label="分析内容"
              width="lg"
              initialValue={
                '近一周饮食不当,一度腹泻,日3次,泻下后精神疲烦,时有低热,怕风,口干,痰中夹有血丝,左侧胸痛时作'
              }
              placeholder="请输入分析内容"
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="从Excel或CSV导入">
            <ProFormUploadDragger
              max={4}
              name="excel-or-csv-file"
              title={'从Excel或CSV导入'}
              description={'数据列名指定为"data"'}
              accept={'.csv,.xls,.xlsx'}
              action={'/main/api/v2/extract_from_table_file'}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="从文本文件导入">
            <ProFormUploadDragger
              max={4}
              name="text-file"
              title={'从文本文件导入'}
              accept={'.txt'}
              action={'/main/api/v2/extract_from_text'}
            />
          </ProCard.TabPane>
        </ProCard>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="knowledgeResult" title="抽取结果" onFinish={stopTwoFinish}>
        <AnnotationCard nerDocs={nerDocs} labels={labels} />
        <div style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '20px' }}>
          <Switch
            checkedChildren={'使用邮件通知'}
            unCheckedChildren={'不需要邮件'}
            defaultChecked={true}
            onChange={(checked) => setNeedEmail(checked)}
          />
        </div>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="buildGraph" title="构建图数据库">
        <PollStopCard taskId={taskId} startPolling={startPolling} />
      </StepsForm.StepForm>
    </StepsForm>
  );
};
