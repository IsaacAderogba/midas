// modules
import React from "react";
import { css } from "styled-components/macro";
import { ApolloError } from "apollo-client";

// components
import { Input, Form, Button, Alert } from "antd";

// helpers
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

interface IAuthForm {
  loading: boolean;
  error: ApolloError | undefined;
  onFinish: ((values: { [key: string]: string }) => void) | undefined;
}

export const LoginForm: React.FC<IAuthForm> = ({
  loading,
  error,
  onFinish,
}) => {
  const { space } = useTheme();

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, type: "email", message: "Please input your email" },
        ]}
      >
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            type: "string",
            message: "Please input your password",
          },
        ]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: `${space[5]}px` }}
        >
          Log in
        </Button>
      </Form.Item>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Alert closable key={i} message={message} type="error" showIcon />
        ))}
    </Form>
  );
};

export const RegisterForm: React.FC<IAuthForm> = ({
  loading,
  error,
  onFinish,
}) => {
  const { space } = useTheme();

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <section
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            margin-right: ${space[4]}px;
            width: 100%;
          `}
        >
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
                type: "string",
                message: "Please input your first name",
              },
            ]}
          >
            <Input placeholder="John" />
          </Form.Item>
        </div>
        <div
          css={css`
            margin-left: ${space[4]}px;
            width: 100%;
          `}
        >
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              {
                required: true,
                type: "string",
                message: "Please input your last name",
              },
            ]}
          >
            <Input placeholder="Doe" />
          </Form.Item>
        </div>
      </section>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, type: "email", message: "Please input your email" },
        ]}
      >
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            type: "string",
            message: "Please input your password",
          },
        ]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: `${space[5]}px` }}
        >
          Sign up
        </Button>
      </Form.Item>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Alert closable key={i} message={message} type="error" showIcon />
        ))}
    </Form>
  );
};
