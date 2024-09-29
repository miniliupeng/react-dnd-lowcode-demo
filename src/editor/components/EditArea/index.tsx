import React, { MouseEventHandler, useEffect, useState } from "react";
import { Component, useComponetsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";

export function EditArea() {
  const { components, addComponent } = useComponetsStore();
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
      if (!config?.component) return null;

      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
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
    console.log(path);
    
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

  return (
    <div className="h-full" onMouseOver={handleMouseOver} >
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
    </div>
  );
}
