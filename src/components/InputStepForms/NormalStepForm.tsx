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
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

export const openNotification = (msg: string) => {
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
  const [startPolling, setStartPolling] = useState(false);
  const [needEmail, setNeedEmail] = useState(true);
  const [projectInfo, setProjectInfo] = useState({
    projectName: 'undefined',
    projectDescription: '',
  });
  const [formHash, setFormHash] = useState('');

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
      openNotification('????????????????????????, ?????????????????????');
      setStartPolling(!startPolling);
    }
    return true;
  };

  return (
    <StepsForm
      onFinish={async () => {
        await waitTime(1000);
        message.success('????????????');
      }}
      formProps={{
        validateMessages: {
          required: '??????????????????',
        },
      }}
    >
      <StepsForm.StepForm
        name="instruction"
        title="??????"
        onFinish={async () => {
          await waitTime(1000);
          return true;
        }}
      >
        <Title level={2}>??????????????????????????????</Title>
        <Paragraph>
          ????????????????????????????????????????????????<Text mark>??????????????????</Text> ????????????,????????????
          <Text mark>??????</Text>.
        </Paragraph>
        <Title level={3}>?????????: ????????????</Title>
        <Paragraph>
          ???????????????????????? <Text mark>???????????? ???????????? ???????????????</Text> ??????????????????, ??????,
          ??????????????????????????????????????????.
        </Paragraph>
        <Paragraph>
          ????????????????????????????????????, ????????????<Text type={'success'}>????????????</Text> \{' '}
          <Text type={'success'}>???Excel???CSV??????</Text> \{' '}
          <Text type={'success'}>?????????????????????</Text> ????????????.
        </Paragraph>
        <Paragraph>
          ????????????????????????????????????????????????????????????, ???????????? <Text mark>????????????????????????</Text>{' '}
          ??????????????????
        </Paragraph>
        <Paragraph>
          ps1. ??????Excel???CSV?????????, ????????????????????????<Text type={'danger'}>data</Text>?????????.
        </Paragraph>
        <Paragraph>
          ps2. ??????????????????, ?????????<Text type={'warning'}>?????????</Text>??????????????????.
        </Paragraph>
        <Title level={3}>?????????: ????????????</Title>
        <Paragraph>
          ?????????????????????????????????????????????, ??????<Text type={'success'}>????????????</Text>{' '}
          ???????????????????????????
        </Paragraph>
        <Title level={3}>?????????: ??????????????????</Title>
        <Paragraph>
          ????????????????????????????????????????????????????????????, ??????
          <Text type={'success'}> ???????????????????????????</Text> , ??????????????????????????????, ?????????????????????{' '}
          <Text type={'secondary'}>(?????????????????????????????????)</Text>.{' '}
        </Paragraph>
        <Paragraph>
          ??????, ????????????????????????ip??? <Text code>7474</Text>????????????neo4j?????????????????????, ????????????{' '}
          <Text mark>?????????????????????????????????</Text> ???????????????????????????????????????????????????.
        </Paragraph>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="dataInput" title="????????????" onFinish={stopOneFinish}>
        <div style={{ marginLeft: '30px' }}>
          <ProFormText
            name="project-name"
            label="????????????"
            width="md"
            tooltip="????????? 24 ??????????????????????????? id"
            placeholder="?????????????????????"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="project-description"
            label="????????????"
            width="lg"
            placeholder="?????????????????????(250?????????)"
            initialValue={'???'}
          />
        </div>
        <ProCard
          tabs={{
            type: 'card',
          }}
        >
          <ProCard.TabPane key="tab1" tab="????????????">
            <ProFormTextArea
              name="message"
              label="????????????"
              width="lg"
              initialValue={
                '?????????????????????,????????????,???3???,?????????????????????,????????????,??????,??????,??????????????????,??????????????????'
              }
              placeholder="?????????????????????"
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="???Excel???CSV??????">
            <ProFormUploadDragger
              max={4}
              name="excel-or-csv-file"
              title={'???Excel???CSV??????'}
              description={'?????????????????????"data"'}
              accept={'.csv,.xls,.xlsx'}
              action={'/main/api/v2/extract_from_table_file'}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="?????????????????????">
            <ProFormUploadDragger
              max={4}
              name="text-file"
              title={'?????????????????????'}
              accept={'.txt'}
              action={'/main/api/v2/extract_from_text'}
            />
          </ProCard.TabPane>
        </ProCard>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="knowledgeResult" title="????????????" onFinish={stopTwoFinish}>
        <AnnotationCard nerDocs={nerDocs} labels={labels} />
        <div style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '20px' }}>
          <Switch
            checkedChildren={'??????????????????'}
            unCheckedChildren={'???????????????'}
            defaultChecked={true}
            onChange={(checked) => setNeedEmail(checked)}
          />
        </div>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="buildGraph" title="??????????????????">
        <PollStopCard taskId={taskId} startPolling={startPolling} />
      </StepsForm.StepForm>
    </StepsForm>
  );
};
