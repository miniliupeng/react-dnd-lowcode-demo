import React, { MouseEventHandler, useEffect, useState } from "react";
import { Component, useComponetsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import HoverMask from "../HoverMask";
import SelectedMask from "../SelectedMask";

export function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponetsStore();
  const { componentConfig } = useComponentConfigStore();
  // useEffect(() => {
  //   addComponent(
  //     {
  //       id: 222,
  //       name: "Container",
  //       props: {},
  //       children: [],
  //     },
  //     1
  //   );
  //   addComponent(
  //     {
  //       id: 333,
  //       name: "Button",
  //       props: {
  //         text: "无敌",
  //       },
  //       children: [],
  //     },
  //     222
  //   );
  // }, []);

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component) => {
      const config = componentConfig[component.name];
      if (!config?.dev) return null;

      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setCurComponentId(+componentId);
        return;
      }
    }
  };

  return (
    <div
      className="edit-area h-full"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={curComponentId}
        />
      )}
      <div className="portal-wrapper"></div>
    </div>
  );
}
