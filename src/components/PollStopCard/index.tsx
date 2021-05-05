import { Steps } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { buildingPolling } from '@/services/site-data/api';
import { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';

const { Step } = Steps;

interface currentState {
  state: string;
  info: {
    current: number;
    total: number;
    config?: Record<string, string>;
  };
  status?: string;
}

export default ({ taskId }: { taskId: string | undefined }) => {
  const [currentState, setCurrentState] = useState<currentState>({
    info: { current: 0, total: 0 },
    state: '',
    status: '',
  });
  const [stepStatus, setStepStatus] = useState<('wait' | 'process' | 'finish' | 'error')[]>([
    'wait',
    'wait',
    'wait',
    'wait',
  ]);
  const [description, setDescription] = useState({});

  const { data, run, cancel } = useRequest(buildingPolling, {
    pollingInterval: 1000,
    pollingWhenHidden: false,
    formatResult: (response) => ({ ...response }),
    manual: true,
  });

  useEffect(() => {
    if (typeof taskId !== 'undefined') {
      run(taskId);
    } else {
      cancel();
    }
  }, [taskId]);

  useEffect(() => {
    if (data) {
      const tmp = {
        state: data.state,
        info: { current: data.info.current, total: data.info.total },
        status: data.status || 'unknown',
      };
      const status = [...stepStatus];
      status[tmp.info.current] = 'process';
      if (tmp.info.current > 0) status[tmp.info.current - 1] = 'finish';
      if (data.state === 'FAILURE') {
        status[3] = 'error';
        setDescription({ error_message: data.status || 'No error message' });
        cancel();
      } else if (data.state === 'SUCCESS') {
        status[3] = 'finish';
        cancel();
        setDescription(data.info.config || {});
      }
      setCurrentState(tmp);
      setStepStatus(status);
    }
  }, [data]);

  return (
    <Steps direction="vertical" size="small" current={currentState.info.current}>
      <Step
        title="CREATE NEO4J SANDBOX"
        description="创建图数据库."
        status={stepStatus[0]}
        disabled={true}
      />
      <Step
        title="INITIALIZE NEO4J"
        description="对图数据库进行初始化."
        status={stepStatus[1]}
        disabled={true}
      />
      <Step title="FILL DATA" description="填充数据." status={stepStatus[2]} disabled={true} />
      <Step title="FINISH" description="图数据库生成完毕." status={stepStatus[3]} disabled={true} />
      <ProCard title="结果" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
        {Object.entries(description).map((elem) => (
          <div key={elem[0]}>
            {elem[0]}:{elem[1]}
          </div>
        ))}
      </ProCard>
    </Steps>
  );
};
