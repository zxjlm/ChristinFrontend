import { message, Modal } from 'antd';
import { StepsForm } from '@ant-design/pro-form';
import { waitTime } from '@/utils/useful';

export default ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (props: boolean) => void;
}) => {
  return (
    <StepsForm
      onFinish={async (values) => {
        console.log(values);
        await waitTime(1000);
        setVisible(false);
        message.success('提交成功');
      }}
      formProps={{
        validateMessages: {
          required: '此项为必填项',
        },
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            title="分步表单"
            width={800}
            onCancel={() => setVisible(false)}
            visible={visible}
            footer={submitter}
            destroyOnClose
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepsForm.StepForm
        name="dataInput"
        title="数据录入"
        onFinish={async () => {
          await waitTime(2000);
          return true;
        }}
      ></StepsForm.StepForm>
      <StepsForm.StepForm name="knowledgeExtract" title="知识抽取"></StepsForm.StepForm>
      <StepsForm.StepForm name="knowledgeResult" title="抽取结果"></StepsForm.StepForm>
      <StepsForm.StepForm name="buildGraph" title="构建图数据库"></StepsForm.StepForm>
      <StepsForm.StepForm name="buildResult" title="图数据库构建结果"></StepsForm.StepForm>
    </StepsForm>
  );
};
