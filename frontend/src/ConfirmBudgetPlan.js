import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, Graph } from 'antd';
import { useState, useContext } from 'react';
import { ThemeContext } from './App';

const { Title } = Typography;

const ConfirmBudgetPlan = () => {
  const theme = useContext(ThemeContext);
  const [form] = Form.useForm();

  return (
    <div style={{ padding: 16 }}>
      <Title level={2}>Confirm Budget Plan</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600, margin: 'auto' }}
      >
        <Form.Item label="Current Budget Plan">

        </Form.Item>
        <Form.Item>
            <Link to="/" style={{ color: theme.primaryColor }}>
          <Button type="primary" htmlType="submit">
            Confirm Budget Plan
          </Button>
          </Link>
        </Form.Item>
      </Form>
      <Link to="/budgetplan" style={{ color: theme.primaryColor }}>
        <Button type="link" htmlType="button">
          Back to Budget Plans
        </Button>
      </Link>
    </div>
  );
};

export default ConfirmBudgetPlan;