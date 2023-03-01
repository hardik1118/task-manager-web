import React, { useEffect, useState } from "react";
import { Badge, Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import CardList from "../../components/cardList";
import { PageHeader } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../utilities/axios";

const HomePage = () => {

  const [apiData, setApiData] = useState([]);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [title, setTitle] = useState();
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(1);

  useEffect(() => {
    axiosInstance.get('/tasks')
      .then(res => {
        const list = res.data?.data;
        setApiData(list);
      });
  }, []);

  const showAddCard = () => {
    setOpenAddCard(true);
  };

  const handleOk = async () => {
    axiosInstance
      .post('tasks', {
        title,
        endDate,
        status
      })
    setOpenAddCard(false);
  };

  const handleCancel = () => {
    setOpenAddCard(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  };
  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString)
  };
  const handleStatusChange = (value) => {
    setStatus(value)
  };

  return (
    <>
      <PageHeader
        extra={[
          <Button size="large" type="primary" shape="round" onClick={showAddCard}>
            <PlusOutlined /> Add Task
          </Button>,
          <span><Badge color="#faad14" /> Pending{' '}</span>,
          <span><Badge color="#f5222d" /> In Progress{' '}</span>,
          <span><Badge color="#a87f32" /> In Review{' '}</span>,
          <span><Badge color="#52c41a" /> Complete{' '}</span>,

        ]}
      />,
      <Row gutter={[16, 24]} className="mainContent">
        <Col className="gutter-row" span={6}>
          {/* <TaskCard title={ 'testing card'} date={ "2023-01-25T13:05:10.000Z"} id={1} /> */}
          {/* <CardList data={[{ id: 2, title: 'test', endDate: '2023-01-24T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }, { id: 1, title: 'test', endDate: '2023-01-25T13:05:10.000Z' }]} /> */}
          <CardList data={apiData?.filter((obj) => obj?.status === 1)} />
        </Col>

        <Col className="gutter-row" span={6}>
          <CardList data={apiData?.filter((obj) => obj?.status === 2)} />
        </Col>
        <Col className="gutter-row" span={6}>
          <CardList data={apiData?.filter((obj) => obj?.status === 3)} />
        </Col>
        <Col className="gutter-row" span={6}>
          <CardList data={apiData?.filter((obj) => obj?.status === 4)} />
        </Col>
      </Row>

      <Modal
        title='Add New Task'
        open={openAddCard}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Title">
            <Input value={title} onChange={handleTitleChange} />
          </Form.Item>
          <Form.Item label="Status">
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
          </Form.Item>
          <Form.Item label="End Date">
            <DatePicker onChange={handleEndDateChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HomePage;
