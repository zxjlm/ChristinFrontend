import styles from "./index.less";
import {Card} from "antd";

export default () => {

  return <div className={styles.container}>
    <div id="components-card-demo-basic">
      <div>
        <Card
          title="项目情况"
          // headStyle={}
        >
        </Card>
      </div>
    </div>
  </div>
};
