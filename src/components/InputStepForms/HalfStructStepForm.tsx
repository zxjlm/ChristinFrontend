import { message } from 'antd';
import { StepsForm } from '@ant-design/pro-form';
import { waitTime } from '@/utils/useful';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

export default () => {
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
      <StepsForm.StepForm
        name="instruction"
        title="说明"
        onFinish={async () => {
          await waitTime(1000);
          return true;
        }}
      >
        <Title level={2}>
          半结构化数据录入说明(<Text type={'danger'}> 开发中</Text>)
        </Title>
        <Paragraph>
          半结构化数据录入目前主要针对的是JSON类型的数据,总共分为<Text mark>三步</Text>.
        </Paragraph>
        <Title level={3}>第一步: 数据录入</Title>
        <Paragraph>
          数据录入需要输入 <Text mark>项目名称 项目描述 待提取数据</Text> 三个基本信息, 其中,
          项目名称与待提取数据为必填项.
        </Paragraph>
        <Paragraph>
          待提取数据为json文件, 并且内容必须符合json的范式, 平台会进行文件内容校验并按照{' '}
          <Text mark>映射逻辑</Text> 进行数据抽取{' '}
        </Paragraph>
        <Title level={3}>第二步: 审核表单</Title>
        <Paragraph>
          平台在会抽取提取到的<Text type={'success'}>一部分</Text> 数据返回并进行数据核验
        </Paragraph>
        <Title level={3}>第三步: 构建图数据库</Title>
        <Paragraph>
          图数据库的构建全程由平台的自动化系统完成, 用户
          <Text type={'success'}> 不需要保持网页焦点</Text> , 在图数据库构建完成后, 会进行邮件通知{' '}
          <Text type={'secondary'}>(如果选择了邮件通知的话)</Text>.{' '}
        </Paragraph>
        <Paragraph>
          最后, 用户可以通过网站ip的 <Text code>7474</Text>端口进行neo4j原生浏览器访问, 或者根据{' '}
          <Text mark>项目信息页面提供的链接</Text> 访问网站自开发的图数据库可视化系统.
        </Paragraph>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="base" title="数据录入" />
      <StepsForm.StepForm name="checkbox" title="审核数据" />
      <StepsForm.StepForm name="time" title="构建图数据库" />
    </StepsForm>
  );
};
