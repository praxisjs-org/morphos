import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { SeparatorProps } from "./separator.types";

@Component()
export class Separator extends StatelessComponent<SeparatorProps> {
  render() {
    const { decorative = false, class: cls, id } = this.props;
    const orientation = () => this.props.orientation ?? "horizontal";

    if (decorative) {
      return (
        <div
          id={id}
          class={cls}
          aria-hidden={"true" as const}
          data-orientation={orientation}
        />
      );
    }

    return (
      <div
        id={id}
        class={cls}
        role="separator"
        aria-orientation={() => (orientation() === "vertical" ? ("vertical" as const) : ("horizontal" as const))}
        data-orientation={orientation}
      />
    );
  }
}
