import ProList from '@ant-design/pro-list';

export interface runtimeDataProp {
  title: string;
  subTitle: string | JSX.Element;
  type: string;
  avatar: string;
  content: string | JSX.Element;
  actions: any[] | JSX.Element;
}

export default ({ runtimeData }: { runtimeData: runtimeDataProp[] }) => {
  return (
    <ProList<any>
      pagination={{
        defaultPageSize: 9,
        showSizeChanger: false,
      }}
      grid={{ gutter: 16, column: 3 }}
      showActions={'hover'}
      showExtra={'hover'}
      metas={{
        title: {},
        subTitle: {},
        type: {},
        avatar: {},
        content: {},
        actions: {},
      }}
      headerTitle="项目管理"
      dataSource={runtimeData}
    />
  );
};
