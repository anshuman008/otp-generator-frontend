import React, { useState } from "react";
import { Dropdown, Button, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import './menu-bar.scss'

const MenuBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <div className="menu-bar">
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        visible={dropdownVisible}
      getPopupContainer={triggerNode => triggerNode.parentNode}

        onVisibleChange={handleDropdownVisibleChange}
      >
        <Button type="primary">
          {dropdownVisible ? (
            <>
              <MenuFoldOutlined />
            </>
          ) : (
            <>
             <MenuUnfoldOutlined />
            </>
          )}
        </Button>
      </Dropdown>
    </div>
  );
};

export default MenuBar;
