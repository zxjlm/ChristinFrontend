import styles from "./index.less";
import {Card} from "antd";
import {useEffect, useState} from "react";

export default () => {
  const [dataItems, setDataItems] = useState([]);

  useEffect(() => {
    fetch('/get_website_info').then(response => response)
  }, []);


  return <div className={styles.container}>
    <div id="components-card-demo-basic">
      <div>
        <Card
          title="数据存量"
          // extra={<a href="#">More</a>}
          // style={{width: 400}}
        >
          <Card type="inner" title="简介">
            <p>CMKGLab(Chinese Medicine Know Graph Lab) 是中医药数据知识图谱平台.</p>
          </Card>
        </Card>
      </div>
    </div>
  </div>
};
