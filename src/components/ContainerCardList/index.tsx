import { Button, Col, Dropdown, Menu, Modal, Progress, Row, Tag } from 'antd';
import { get_project_detail, projectsRuntime } from '@/services/projects-operator/api';
import { useEffect, useState } from 'react';
import type { runtimeDataProp } from '@/components/ContainerCard';
import ContainerCard from '@/components/ContainerCard/index';
import ProjectDetail from '@/components/ProjectDetail/index';
import styles from './index.less';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const initProjectData: ProjectApi.projectDetailResult = {
    badge_color: '',
    create_date_time: '',
    data: [],
    login_name: '',
    mark: '',
    remark: { password: '', port: '' },
    s_project_description: '',
    s_project_name: '',
    status: '',
    labels: [],
    update_date_time: '',
  };

  const [projectsRuntimeInfo, setProjectsRuntimeInfo] = useState<ProjectApi.runtimeResult>({
    creating: [],
    deleted: [],
    exited: [],
    running: [],
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [transferData, setTransferData] = useState<ProjectApi.projectDetailResult>(initProjectData);
  const { nerDocs, setNerDocs } = useModel('nerDocs', (model) => ({
    setNerDocs: model.setNerDocs,
    nerDocs: model.nerDocs,
  }));

  const menu = (cardId: string) => {
    const view = () => {
      get_project_detail(cardId).then((data) => setTransferData(data));
    };

    return (
      <Menu>
        <Menu.Item>
          <a onClick={view}>查看</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
            休眠
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            删除
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  useEffect(() => {
    projectsRuntime().then((result) => setProjectsRuntimeInfo(result));
    return () => {};
  }, []);

  useEffect(() => {
    if (transferData.login_name !== '') {
      setNerDocs(transferData.data);
    }
    return () => {};
  }, [setNerDocs, transferData]);

  useEffect(() => {
    if (transferData.login_name !== '') {
      setDetailModalVisible(true);
    }
    return () => {};
  }, [nerDocs]);

  return (
    <div>
      <ContainerCard
        runtimeData={projectsRuntimeInfo.deleted.map(
          (item): runtimeDataProp => ({
            title: item.s_project_name,
            subTitle: <Tag color="#5BD8A6">{item.login_name}</Tag>,
            type: item.status,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
            content: (
              <div
                style={{
                  flex: 1,
                }}
              >
                <Row>
                  <Col span={6}>子任务进度:</Col>
                  <Col span={10}>
                    <Progress percent={100} />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>创建日期:</Col>
                  <Col className={styles[item.badge_color]}>
                    {new Date(Date.parse(item.create_date_time)).toLocaleString()}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>项目描述:</Col>
                  <Col span={10}>{item.s_project_description || '无项目说明'}</Col>
                </Row>
              </div>
            ),
            actions: (
              <Dropdown overlay={menu(item.mark)} placement="bottomLeft" arrow>
                <Button>管理</Button>
              </Dropdown>
            ),
          }),
        )}
      />
      <Modal
        title="项目详情"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setTransferData(initProjectData);
          setNerDocs(initProjectData.data);
        }}
        width={'50%'}
      >
        <ProjectDetail projectData={transferData} />
      </Modal>
    </div>
  );
};
