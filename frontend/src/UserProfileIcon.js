import React, { useContext } from 'react';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserProfileIcon = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return user ? (
    <Dropdown overlay={menu} trigger={['click']}>
      <Avatar
        src={user.picture}
        alt="User Profile"
        size={64}
        style={{ cursor: 'pointer', marginLeft: '10px' }}
      />
    </Dropdown>
  ) : (
    <Button
      type="primary"
      icon={<LoginOutlined />}
      onClick={handleLoginClick}
      style={{ marginLeft: '10px' }}
    >
      Login
    </Button>
  );
};

export default UserProfileIcon;
