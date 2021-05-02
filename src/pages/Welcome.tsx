import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Alert, Typography, Row, Col} from 'antd';
import {useIntl, FormattedMessage} from 'umi';
import styles from './Welcome.less';
import Introduction from './WelCome/WebsiteIntro';
import DataStoreIntro from './WelCome/DataStoreIntro';
import ProjectIntro from './WelCome/ProjectIntro';
import {websiteBasicData} from "@/services/site-data/api";

const CodePreview: React.FC = ({children}) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export interface dataItemsState {
  name: string,
  value: number
}

const babelMapper = {
  "user_c": '用户数量',
  "herb_c": '中药',
  "pre_c": '处方',
  "gene_c": '基因',
  "pro_c": '蛋白质',
  "other_c": '其他',
  "total_c": '总计',
}

export default (): React.ReactNode => {
  const intl = useIntl();

  const [userNumbers, setUserNumbers] = useState(0);
  const [dataItems, setDataItems] = useState<dataItemsState[]>([]);

  useEffect(() => {
    websiteBasicData().then(data => {
      const items: dataItemsState[] = []
      Object.entries(data).forEach(elem => {
        if (elem[0] !== 'user_c') items.push({name: babelMapper[elem[0]], value: elem[1]} as dataItemsState)
      })
      setUserNumbers(data.user_c)
      setDataItems(items)
    });
  }, []);

  return (
    <PageContainer>
      <Row>
        <Col span={8}><Introduction userNumbers={userNumbers}/></Col>
        <Col span={5} offset={1}><DataStoreIntro dataItems={dataItems}/></Col>
        <Col span={4} offset={1}><ProjectIntro/></Col>
      </Row>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: '更快更强的重型组件，已经发布。',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="高级表格"/>{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用"/>
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="高级布局"/>{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用"/>
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};
