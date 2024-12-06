import React, { useContext } from 'react';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/**
 * UserProfileIcon component displays a user avatar with a dropdown menu if the user is logged in.
 * If no user is logged in, it shows a login button instead.
 *
 * @component
 * @returns {JSX.Element} The rendered UserProfileIcon component.
 */
const UserProfileIcon = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout function from AuthContext
  const navigate = useNavigate();

  /**
   * Handles the click event for the login button, navigating the user to the login page.
   */
  const handleLoginClick = () => {
    navigate('/login');
  };

  /**
   * Dropdown menu options for the user profile.
   * Includes "Profile" (navigates to the home page) and "Logout" options.
   */
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/">Profile</Link>
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
