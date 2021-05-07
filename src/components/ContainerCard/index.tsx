import ProList from '@ant-design/pro-list';

interface runtimeDataProp {
  title: string;
  subTitle: string;
  type: string;
  avatar: string;
  content: string;
  actions: [];
}

export default ({ runtimeData }: { runtimeData: runtimeDataProp[] }) => {
  return (
    <ProList<any>
      pagination={{
        defaultPageSize: 8,
        showSizeChanger: false,
      }}
      grid={{ gutter: 16, column: 2 }}
      metas={{
        title: {},
        subTitle: {},
        type: {},
        avatar: {},
        content: {},
        actions: {},
      }}
      headerTitle="翻页"
      dataSource={runtimeData}
    />
  );
};
