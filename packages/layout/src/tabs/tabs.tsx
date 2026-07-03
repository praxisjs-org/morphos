import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import { generateId, Keys, wrapIndex, type Orientation  } from "@morphos/core";

import type {
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
} from "./tabs.types";

@Component()
export class Tabs extends StatefulComponent {
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() orientation: Orientation = "horizontal";
  @Prop() onValueChange?: TabsProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: TabsProps["children"];

  @State() _value: string | undefined = undefined;

  /** Registered tab values in DOM order — populated by Tab on mount. */
  readonly _tabValues: string[] = [];

  onBeforeMount() {
    this._value = this.defaultValue;
  }

  get selectedValue(): string | undefined {
    return this.value ?? this._value;
  }

  @Emit("onValueChange")
  select(value: string) {
    if (this.value === undefined) this._value = value;
    return value;
  }

  /** Moves focus to the next or previous enabled tab based on keyboard input. */
  navigate(direction: "next" | "prev" | "first" | "last") {
    const current = this._tabValues.indexOf(this.selectedValue ?? "");
    let next: number;

    if (direction === "first") {
      next = 0;
    } else if (direction === "last") {
      next = this._tabValues.length - 1;
    } else {
      const delta = direction === "next" ? 1 : -1;
      next = wrapIndex(current + delta, this._tabValues.length);
    }

    const nextValue = this._tabValues[next] as string | undefined;
    if (nextValue !== undefined) {
      this.select(nextValue);
    }
  }

  render() {
    return (
      <div
        id={this.id}
        class={this.class}
        data-orientation={() => this.orientation}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class TabList extends StatelessComponent<TabListProps> {
  render() {
    const {
      tabs,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    } = this.props;

    return (
      <div
        id={id}
        role="tablist"
        class={cls}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-orientation={() => tabs.orientation}
        onKeyDown={(e: KeyboardEvent) => {
          const isHorizontal = tabs.orientation === "horizontal";
          if (isHorizontal && e.key === Keys.ArrowRight) tabs.navigate("next");
          else if (isHorizontal && e.key === Keys.ArrowLeft) tabs.navigate("prev");
          else if (!isHorizontal && e.key === Keys.ArrowDown) tabs.navigate("next");
          else if (!isHorizontal && e.key === Keys.ArrowUp) tabs.navigate("prev");
          else if (e.key === Keys.Home) tabs.navigate("first");
          else if (e.key === Keys.End) tabs.navigate("last");
        }}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class Tab extends StatefulComponent {
  @Prop() tabs!: Tabs;
  @Prop() value!: string;
  @Prop() disabled = false;
  @Prop() children?: TabProps["children"];
  @Prop() class?: string;
  @Prop() id?: string;

  private readonly _tabId = generateId("tab");
  private readonly _panelId = generateId("tab-panel");

  /** Exposes panel ID so TabPanel can reference it. */
  get panelId(): string {
    return this._panelId;
  }

  onMount() {
    if (!this.tabs._tabValues.includes(this.value)) {
      this.tabs._tabValues.push(this.value);
    }
  }

  onUnmount() {
    const idx = this.tabs._tabValues.indexOf(this.value);
    if (idx >= 0) this.tabs._tabValues.splice(idx, 1);
  }

  render() {
    return (
      <button
        id={this.id ?? this._tabId}
        type="button"
        role="tab"
        class={this.class}
        disabled={this.disabled}
        aria-selected={() => (this.tabs.selectedValue === this.value ? "true" : "false")}
        aria-controls={this._panelId}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        tabIndex={() => (this.tabs.selectedValue === this.value ? 0 : -1)}
        data-selected={() => (this.tabs.selectedValue === this.value ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
        onClick={() => { if (!this.disabled) this.tabs.select(this.value); }}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class TabPanel extends StatelessComponent<TabPanelProps> {
  render() {
    const { tabs, value, children, class: cls, id } = this.props;
    return (
      <div
        id={id}
        role="tabpanel"
        class={cls}
        aria-labelledby={value}
        hidden={() => tabs.selectedValue !== value}
        data-selected={() => (tabs.selectedValue === value ? "" : undefined)}
      >
        {children}
      </div>
    );
  }
}
