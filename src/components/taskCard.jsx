import { EditOutlined, HistoryOutlined } from "@ant-design/icons";
import { Badge, Button, Card, DatePicker, Modal, Select, Space, Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { axiosInstance } from "../utilities/axios";
import TabPane from "antd/es/tabs/TabPane";
import { CONFIGURATIONS } from "../config";

const style = { margin: "8px 0" };

const TaskCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [tabContent, setTabContent] = useState('');
  const [loading, setLoading] = useState(false);
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
  }, [])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handlehistoryModal = async () => {
    setLoading(true);
    await axiosInstance
      .get(`tasks/${props?.id}/history`, {
        endDate: endDate || null,
        status
      }).then(async res => {
        const list = res.data?.data;
        setHistory(list);
        setLoading(false);
        setHistoryModalOpen(true);
      });
  };

  const closehistoryModal = () => {
    setHistoryModalOpen(false);
  }

  const handleOk = async () => {
    setLoading(true);
    await axiosInstance
      .patch(`tasks/${props?.id}`, {
        endDate: endDate || null,
        status
      }).then((res) => {
        setLoading(false);
      });
    props.loadtasks();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString)
  };
  const handleStatusChange = (value) => {
    setStatus(value)
  };

  const handleHistoryTabCange = async (key) => {
    if (Number(key) === 2) {
      const data = history.filter((obj) => obj.type === 2)
      setTabContent(data.map((obj) => <p>{moment(obj.value).format('DD-MM-YYYY')} : {moment(obj.createdAt).format('DD-MM-YYYY')}</p>))
    } else {
      const data = history.filter((obj) => obj.type === 1)
      setTabContent(data.map((obj) => <p>{CONFIGURATIONS['status'][`${obj.value}`]} : {moment(obj.createdAt).format('DD-MM-YYYY')}</p>))
    }
  }



  const extraIcons = (
    <>
      {" "}
      <Button type="text" onClick={handlehistoryModal} shape="circle">
        <HistoryOutlined />
      </Button>
      <Button type="text" onClick={showModal} shape="circle">
        <EditOutlined />
      </Button>
      <Badge color={`#${CONFIGURATIONS.color[props.status]}`} />
    </>
  );

  return (
    <>
      <div style={style}>
        <Card
          title={`#${props.id}`}
          size="small"
          bordered={true}
          extra={extraIcons}
        >
          <p>{props?.title}</p>
          <p >ETA : {new Date(props?.endDate).toLocaleDateString()}</p>
        </Card>
      </div>

      <Modal
        title={`#${props.id}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{props.title}</p>

        <p>
          End Date : {" "}
          <DatePicker
            bordered={true}
            format={dateFormat}
            onChange={handleEndDateChange}
          />
        </p>{" "}
        <p>
          Status : {" "}
          <Select
            style={{
              width: 120,
            }}
            onChange={handleStatusChange}
            options={[
              {
                value: 1,
                label: 'Pending',
              },
              {
                value: 2,
                label: 'In Progress',
              },
              {
                value: 3,
                label: 'In Review',
              },
              {
                value: 4,
                label: 'Complete',
              },
            ]}
          />
        </p>{" "}
      </Modal>

      <Modal
        title={`#${props.id}`}
        open={historyModalOpen}
        onOk={closehistoryModal}
        onCancel={closehistoryModal}
      >
        <Tabs defaultActiveKey="2" onChange={handleHistoryTabCange} >
          <TabPane tab='Date History' key={2} >{tabContent}</TabPane>
          <TabPane tab='Status History' key={1} >{tabContent}</TabPane>
        </Tabs>
        <Spin spinning={loading}></Spin>
      </Modal>

    </>
  );
};

export default TaskCard;
