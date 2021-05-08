import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CreateProject from './ProjectsManagement/index';

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <CreateProject />
    </PageContainer>
  );
};
