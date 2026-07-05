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

  /** @internal — the registered viewport element; written by `ScrollAreaViewport` on mount, read by `ScrollAreaScrollbar`/`ScrollAreaThumb` to drive scrolling imperatively. */
  _viewportEl: HTMLElement | null = null;

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

  /** @internal — registered by `ScrollAreaViewport` on mount. */
  _registerViewport(el: HTMLElement | null) {
    this._viewportEl = el;
  }

  /** Imperatively scrolls the viewport — used by `ScrollAreaScrollbar` (click-to-jump) and `ScrollAreaThumb` (drag). Values are clamped to the valid scroll range. */
  scrollTo(position: { top?: number; left?: number }): void {
    if (!this._viewportEl) return;
    if (position.top !== undefined) {
      this._viewportEl.scrollTop = Math.min(Math.max(position.top, 0), this._scrollHeight - this._clientHeight);
    }
    if (position.left !== undefined) {
      this._viewportEl.scrollLeft = Math.min(Math.max(position.left, 0), this._scrollWidth - this._clientWidth);
    }
    this._onScroll(this._viewportEl);
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
      this.scrollArea._registerViewport(this.viewportRef.current);
      this.scrollArea._onScroll(this.viewportRef.current);
    }
  }

  onUnmount() {
    this.scrollArea._registerViewport(null);
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

    /**
     * Clicking the track itself (not the thumb — `ScrollAreaThumb`'s own `onMouseDown` stops
     * propagation before this ever fires) jumps the scroll position to wherever was clicked,
     * matching native scrollbar track-click behavior.
     */
    const handleTrackMouseDown = (event: MouseEvent) => {
      const track = event.currentTarget as HTMLElement;
      const rect = track.getBoundingClientRect();

      if (orientation() === "horizontal") {
        const range = scrollArea._scrollWidth - scrollArea._clientWidth;
        if (range <= 0) return;
        const fraction = (event.clientX - rect.left) / rect.width;
        scrollArea.scrollTo({ left: fraction * range });
      } else {
        const range = scrollArea._scrollHeight - scrollArea._clientHeight;
        if (range <= 0) return;
        const fraction = (event.clientY - rect.top) / rect.height;
        scrollArea.scrollTo({ top: fraction * range });
      }
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
        onMouseDown={handleTrackMouseDown}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class ScrollAreaThumb extends StatefulComponent {
  @Prop() scrollArea?: ScrollAreaThumbProps["scrollArea"];
  @Prop() orientation?: ScrollAreaThumbProps["orientation"];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLElement>()
  thumbRef!: RefType<HTMLElement>;

  render() {
    const { scrollArea, class: cls, id } = this;
    const orientation = () => this.orientation ?? "vertical";

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

    /**
     * Drags the thumb: moving the pointer by `pixelDelta` along the track moves the scroll
     * position by `pixelDelta * (scrollableRange / trackTravelableLength)` — the same ratio a
     * native scrollbar thumb uses, since the thumb can only travel `trackLength - thumbLength`
     * pixels to cover the full scrollable range.
     */
    const handleThumbMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!scrollArea) return;

      const thumbEl = this.thumbRef.current;
      const track = thumbEl?.parentElement;
      if (!thumbEl || !track) return;

      const isHorizontal = orientation() === "horizontal";
      const trackRect = track.getBoundingClientRect();
      const trackLength = isHorizontal ? trackRect.width : trackRect.height;
      const thumbLength = isHorizontal ? thumbEl.offsetWidth : thumbEl.offsetHeight;
      const travelableLength = trackLength - thumbLength;

      const { total, visible } = _metrics();
      const scrollableRange = total - visible;

      const startPointer = isHorizontal ? event.clientX : event.clientY;
      const startScroll = isHorizontal ? scrollArea._scrollLeft : scrollArea._scrollTop;

      const handlePointerMove = (moveEvent: MouseEvent) => {
        if (travelableLength <= 0 || scrollableRange <= 0) return;
        const pointer = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
        const pixelDelta = pointer - startPointer;
        const scrollDelta = pixelDelta * (scrollableRange / travelableLength);
        if (isHorizontal) {
          scrollArea.scrollTo({ left: startScroll + scrollDelta });
        } else {
          scrollArea.scrollTo({ top: startScroll + scrollDelta });
        }
      };

      const handlePointerUp = () => {
        document.removeEventListener("mousemove", handlePointerMove);
        document.removeEventListener("mouseup", handlePointerUp);
      };

      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerUp);
    };

    return (
      <div
        id={id}
        ref={this.thumbRef}
        class={cls}
        style={() => ({
          "--morphos-thumb-size": `${String(_size())}%`,
          "--morphos-thumb-offset": `${String(_offset())}%`,
        })}
        onMouseDown={handleThumbMouseDown}
      />
    );
  }
}
