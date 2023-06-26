/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuService } from "../services/menu.service";
import { Menu } from "../models/menu.model";
import { MenuIcons } from "../icons/menu_icons";

const SidebarMenuMain = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const constructMenus = async () => {
    const request = await MenuService.constructMenu();
    if ("data" in request) {
      setMenus(request.data.appMenus);
    }
  };

  const getMenuName = (menu: any): string => {
    return MenuIcons?.[menu.name]
      ? MenuIcons?.[menu.name].menuIcon
      : "fa-solid fa-bars";
  };

  const getSubMenuName = (menu: any, subMenu: any): string => {
    return MenuIcons?.[menu.name]?.subMenuIcons?.[subMenu.name]
      ? MenuIcons?.[menu.name]?.subMenuIcons?.[subMenu.name]
      : "fa-solid fa-bars";
  };

  useEffect(() => {
    constructMenus();
  }, []);

  return (
    <>
      {menus?.map((menu, index) => {
        return (
          <React.Fragment key={menu.name}>
            {menu.hasSubMenus ? (
              <SidebarMenuItemWithSub
                key={index}
                title={menu.name}
                to={null}
                fontIcon={getMenuName(menu)}
              >
                {menu.appSubMenus?.map((subMenu) => {
                  return (
                    <SidebarMenuItem
                      key={subMenu.appSubMenuId}
                      title={subMenu.name}
                      to={subMenu.url}
                      hasBullet={false}
                      fontIcon={getSubMenuName(menu, subMenu)}
                    />
                  );
                })}
              </SidebarMenuItemWithSub>
            ) : (
              <SidebarMenuItem
                key={index}
                title={menu.name}
                to={menu.url}
                fontIcon={getMenuName(menu)}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export { SidebarMenuMain };
