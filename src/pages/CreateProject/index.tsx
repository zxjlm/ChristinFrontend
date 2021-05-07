import styles from './index.less';
import { Menu, Dropdown } from 'antd';
import { BarsOutlined, FileTextOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import NormalStepFrom from '@/pages/InputStepForms/NormalStepFrom';
import ContainerCardList from '@/components/ContainerCardList/index';

export default () => {
  const [visible, setVisible] = useState(false);

  function handleMenuClick(e: any) {
    if (e.key === '3') setVisible(true);
  }

  return (
    <div className={styles.container}>
      <div id="components-dropdown-demo-dropdown-button">
        <div id="components-dropdown-demo-dropdown-button">
          <Dropdown.Button
            overlay={
              <Menu onClick={handleMenuClick}>
                <Menu.Item key="1">
                  <BarsOutlined />
                  结构化数据
                </Menu.Item>
                <Menu.Item key="2">
                  <MenuUnfoldOutlined />
                  半结构化数据
                </Menu.Item>
                <Menu.Item key="3">
                  <FileTextOutlined />
                  非结构化数据
                </Menu.Item>
              </Menu>
            }
          >
            创建项目
          </Dropdown.Button>
        </div>
      </div>
      <ContainerCardList />

      <NormalStepFrom visible={visible} setVisible={setVisible} />
    </div>
  );
};