import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";

import type {
  ScrollAreaProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from "./scroll-area.types";

@Component()
export class ScrollArea extends StatefulComponent {
  @Prop() type: ScrollAreaProps["type"] = "hover";
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ScrollAreaProps["children"];

  @State() _scrollTop = 0;
  @State() _scrollLeft = 0;
  @State() _scrollHeight = 0;
  @State() _clientHeight = 0;
  @State() _scrollWidth = 0;
  @State() _clientWidth = 0;

  onBeforeMount() {
    this._scrollTop = 0;
    this._scrollLeft = 0;
    this._scrollHeight = 0;
    this._clientHeight = 0;
    this._scrollWidth = 0;
    this._clientWidth = 0;
  }

  get canScrollY(): boolean {
    return this._scrollHeight > this._clientHeight;
  }

  get canScrollX(): boolean {
    return this._scrollWidth > this._clientWidth;
  }

  _onScroll(el: HTMLElement) {
    this._scrollTop = el.scrollTop;
    this._scrollLeft = el.scrollLeft;
    this._scrollHeight = el.scrollHeight;
    this._clientHeight = el.clientHeight;
    this._scrollWidth = el.scrollWidth;
    this._clientWidth = el.clientWidth;
  }

  render() {
    return (
      <div
        id={this.id}
        class={this.class}
        data-type={this.type}
        data-scrollable={() => (this.canScrollY || this.canScrollX ? "" : undefined)}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class ScrollAreaViewport extends StatefulComponent {
  @Prop() scrollArea!: ScrollArea;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ScrollAreaViewportProps["children"];

  @Ref<HTMLElement>()
  viewportRef!: RefType<HTMLElement>;

  onMount() {
    if (this.viewportRef.current) {
      this.scrollArea._onScroll(this.viewportRef.current);
    }
  }

  render() {
    return (
      <div
        id={this.id}
        ref={this.viewportRef}
        class={this.class}
        style={{ overflow: "auto", width: "100%", height: "100%" }}
        onScroll={(e: Event) => {
          const el = e.target as HTMLElement;
          this.scrollArea._onScroll(el);
        }}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class ScrollAreaScrollbar extends StatelessComponent<ScrollAreaScrollbarProps> {
  render() {
    const { scrollArea, children, class: cls, id } = this.props;
    const orientation = () => this.props.orientation ?? "vertical";

    const valueNow = () => {
      if (orientation() === "horizontal") {
        const range = scrollArea._scrollWidth - scrollArea._clientWidth;
        if (range <= 0) return 0;
        return Math.round((scrollArea._scrollLeft / range) * 100);
      }
      const range = scrollArea._scrollHeight - scrollArea._clientHeight;
      if (range <= 0) return 0;
      return Math.round((scrollArea._scrollTop / range) * 100);
    };

    return (
      <div
        id={id}
        class={cls}
        role="scrollbar"
        aria-orientation={() => (orientation() === "vertical" ? ("vertical" as const) : ("horizontal" as const))}
        aria-valuenow={() => valueNow()}
        aria-valuemin={0}
        aria-valuemax={100}
        data-orientation={orientation}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class ScrollAreaThumb extends StatelessComponent<ScrollAreaThumbProps> {
  render() {
    const { scrollArea, class: cls, id } = this.props;
    const orientation = () => this.props.orientation ?? "vertical";

    const _metrics = () => {
      if (!scrollArea) return { total: 0, visible: 0, scrolled: 0 };
      return orientation() === "horizontal"
        ? { total: scrollArea._scrollWidth, visible: scrollArea._clientWidth, scrolled: scrollArea._scrollLeft }
        : { total: scrollArea._scrollHeight, visible: scrollArea._clientHeight, scrolled: scrollArea._scrollTop };
    };

    const _size = () => {
      const { total, visible } = _metrics();
      if (total <= 0) return 100;
      return Math.min(100, (visible / total) * 100);
    };

    const _offset = () => {
      const { total, visible, scrolled } = _metrics();
      const range = total - visible;
      if (range <= 0) return 0;
      return (scrolled / range) * (100 - _size());
    };

    return (
      <div
        id={id}
        class={cls}
        style={() => ({
          "--morphos-thumb-size": `${String(_size())}%`,
          "--morphos-thumb-offset": `${String(_offset())}%`,
        })}
      />
    );
  }
}
