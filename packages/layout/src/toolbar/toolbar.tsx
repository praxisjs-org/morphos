import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";

import { Keys, wrapIndex } from "@morphos/core";

import type {
  ToolbarButtonProps,
  ToolbarProps,
  ToolbarSeparatorProps,
} from "./toolbar.types";

@Component()
export class Toolbar extends StatefulComponent {
  @Prop() orientation: ToolbarProps["orientation"] = "horizontal";
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ToolbarProps["children"];

  @State() _focusedIndex = 0;
  /** Bumped on every register/unregister so reactive bindings that read `_items` (a plain array) update. */
  @State() _itemsVersion = 0;
  readonly _items: HTMLElement[] = [];

  onBeforeMount() {
    this._focusedIndex = 0;
  }

  registerItem(el: HTMLElement) {
    if (!this._items.includes(el)) {
      this._items.push(el);
      this._itemsVersion++;
    }
  }

  unregisterItem(el: HTMLElement) {
    const idx = this._items.indexOf(el);
    if (idx >= 0) {
      this._items.splice(idx, 1);
      this._itemsVersion++;
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    const isHorizontal = this.orientation === "horizontal";
    let newIndex = this._focusedIndex;

    if (isHorizontal && e.key === Keys.ArrowRight) {
      e.preventDefault();
      newIndex = wrapIndex(this._focusedIndex + 1, this._items.length);
    } else if (isHorizontal && e.key === Keys.ArrowLeft) {
      e.preventDefault();
      newIndex = wrapIndex(this._focusedIndex - 1, this._items.length);
    } else if (!isHorizontal && e.key === Keys.ArrowDown) {
      e.preventDefault();
      newIndex = wrapIndex(this._focusedIndex + 1, this._items.length);
    } else if (!isHorizontal && e.key === Keys.ArrowUp) {
      e.preventDefault();
      newIndex = wrapIndex(this._focusedIndex - 1, this._items.length);
    } else {
      return;
    }

    this._focusedIndex = newIndex;
    this._items[newIndex]?.focus();
  }

  render() {
    return (
      <div
        id={this.id}
        class={() => this.class}
        role="toolbar"
        aria-orientation={() => (this.orientation === "vertical" ? ("vertical" as const) : ("horizontal" as const))}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-orientation={() => this.orientation}
        onKeyDown={(e: KeyboardEvent) => { this.handleKeyDown(e); }}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class ToolbarButton extends StatefulComponent {
  @Prop() toolbar!: Toolbar;
  @Prop() disabled = false;
  @Prop() onClick?: ToolbarButtonProps["onClick"];
  @Prop() "aria-label"?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ToolbarButtonProps["children"];

  @Ref<HTMLButtonElement>()
  buttonRef!: RefType<HTMLButtonElement>;

  onMount() {
    if (!this.disabled && this.buttonRef.current) {
      this.toolbar.registerItem(this.buttonRef.current);
    }
  }

  onUnmount() {
    if (this.buttonRef.current) {
      this.toolbar.unregisterItem(this.buttonRef.current);
    }
  }

  private _computeTabIndex(): number {
    void this.toolbar._itemsVersion;
    const current = this.buttonRef.current;
    if (!current) return -1;
    return this.toolbar._focusedIndex === this.toolbar._items.indexOf(current) ? 0 : -1;
  }

  private readonly _handleClick = () => {
    if (!this.disabled) this.onClick?.();
  };

  render() {
    return (
      <button
        id={this.id}
        ref={this.buttonRef}
        type="button"
        class={() => this.class}
        disabled={this.disabled}
        aria-label={this["aria-label"]}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        data-disabled={this.disabled ? "" : undefined}
        tabIndex={() => this._computeTabIndex()}
        onClick={this._handleClick}
      >
        {this.children}
      </button>
    );
  }
}

@Component()
export class ToolbarSeparator extends StatelessComponent<ToolbarSeparatorProps> {
  render() {
    const { toolbar, class: cls, id } = this.props;
    const perpendicular = () => (toolbar.orientation === "horizontal" ? "vertical" : "horizontal");

    return (
      <div
        id={id}
        class={cls}
        role="separator"
        aria-orientation={() => (perpendicular() === "vertical" ? ("vertical" as const) : ("horizontal" as const))}
        data-orientation={perpendicular}
      />
    );
  }
}
