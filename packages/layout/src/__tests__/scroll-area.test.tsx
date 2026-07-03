// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "../scroll-area/scroll-area";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("ScrollArea", () => {
  it("renders with type=hover by default and no data-scrollable", () => {
    const container = mount(() => (
      <ScrollArea id="sa-1" class="sa">
        <div>content</div>
      </ScrollArea>
    ));
    const root = container.firstElementChild as HTMLElement;
    expect(root.id).toBe("sa-1");
    expect(root.className).toBe("sa");
    expect(root.getAttribute("data-type")).toBe("hover");
    expect(root.hasAttribute("data-scrollable")).toBe(false);
    expect(root.textContent).toBe("content");
  });

  it("supports the other type values", () => {
    const container = mount(() => <ScrollArea type="always" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-type")).toBe("always");
  });

  it("sets data-scrollable when the content overflows (reacts to state changes after mount)", async () => {
    let instance!: ScrollArea;
    const container = mount(() => (
      <ScrollArea ref={(inst: ScrollArea | null) => { if (inst) instance = inst; }} />
    ));
    await Promise.resolve();
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute("data-scrollable")).toBe(false);
    instance._onScroll({ scrollTop: 0, scrollLeft: 0, scrollHeight: 500, clientHeight: 200 } as HTMLElement);
    expect(root.getAttribute("data-scrollable")).toBe("");
  });

  it("canScrollY reflects scrollHeight vs clientHeight", () => {
    const area = new ScrollArea();
    area.onBeforeMount?.();
    expect(area.canScrollY).toBe(false);
    area._onScroll({ scrollTop: 10, scrollLeft: 5, scrollHeight: 500, clientHeight: 200 } as HTMLElement);
    expect(area.canScrollY).toBe(true);
  });

  it("canScrollX reflects scrollWidth vs clientWidth", () => {
    const area = new ScrollArea();
    area.onBeforeMount?.();
    expect(area.canScrollX).toBe(false);
    area._onScroll({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      clientHeight: 0,
      scrollWidth: 900,
      clientWidth: 300,
    } as HTMLElement);
    expect(area.canScrollX).toBe(true);
  });

  it("data-scrollable is set when only the X axis overflows", async () => {
    let instance!: ScrollArea;
    const container = mount(() => (
      <ScrollArea ref={(inst: ScrollArea | null) => { if (inst) instance = inst; }} />
    ));
    await Promise.resolve();
    const root = container.firstElementChild as HTMLElement;
    instance._onScroll({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      clientHeight: 0,
      scrollWidth: 900,
      clientWidth: 300,
    } as HTMLElement);
    expect(root.getAttribute("data-scrollable")).toBe("");
  });

  it("_onScroll updates all tracked scroll metrics, including width", () => {
    const area = new ScrollArea();
    area.onBeforeMount?.();
    area._onScroll({
      scrollTop: 10,
      scrollLeft: 5,
      scrollHeight: 500,
      clientHeight: 200,
      scrollWidth: 900,
      clientWidth: 300,
    } as HTMLElement);
    expect(area._scrollTop).toBe(10);
    expect(area._scrollLeft).toBe(5);
    expect(area._scrollHeight).toBe(500);
    expect(area._clientHeight).toBe(200);
    expect(area._scrollWidth).toBe(900);
    expect(area._clientWidth).toBe(300);
  });
});

describe("ScrollAreaViewport", () => {
  it("computes the initial scroll metrics on mount, not just after a scroll event", async () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const container = mount(() => (
      <ScrollAreaViewport scrollArea={scrollArea} id="vp-mount">
        <div>content</div>
      </ScrollAreaViewport>
    ));
    const viewport = container.querySelector("#vp-mount") as HTMLElement;
    Object.defineProperty(viewport, "scrollHeight", { value: 900, configurable: true });
    Object.defineProperty(viewport, "clientHeight", { value: 300, configurable: true });
    await Promise.resolve();
    expect(scrollArea._scrollHeight).toBe(900);
    expect(scrollArea._clientHeight).toBe(300);
    expect(scrollArea.canScrollY).toBe(true);
  });

  it("onMount is a no-op when the ref hasn't attached to an element", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const viewport = new ScrollAreaViewport({ scrollArea });
    expect(() => { viewport.onMount?.(); }).not.toThrow();
    expect(scrollArea._scrollHeight).toBe(0);
  });

  it("wires the native scroll event to scrollArea._onScroll", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const container = mount(() => (
      <ScrollAreaViewport scrollArea={scrollArea} id="vp-1" class="vp">
        <div style={{ height: "1000px" }}>tall content</div>
      </ScrollAreaViewport>
    ));
    const viewport = container.querySelector("#vp-1") as HTMLElement;
    expect(viewport.className).toBe("vp");
    Object.defineProperty(viewport, "scrollTop", { value: 42, configurable: true });
    Object.defineProperty(viewport, "scrollLeft", { value: 7, configurable: true });
    Object.defineProperty(viewport, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(viewport, "clientHeight", { value: 300, configurable: true });
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }));
    expect(scrollArea._scrollTop).toBe(42);
    expect(scrollArea._scrollLeft).toBe(7);
    expect(scrollArea._scrollHeight).toBe(1000);
    expect(scrollArea._clientHeight).toBe(300);
  });
});

describe("ScrollAreaScrollbar", () => {
  it("renders its children (e.g. a ScrollAreaThumb) instead of dropping them", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const container = mount(() => (
      <ScrollAreaScrollbar scrollArea={scrollArea}>
        <ScrollAreaThumb class="th" />
      </ScrollAreaScrollbar>
    ));
    const bar = container.querySelector('[role="scrollbar"]') as HTMLElement;
    const thumb = bar.querySelector(".th");
    expect(thumb).toBeTruthy();
  });

  it("defaults to vertical orientation and 0% value when there is no scrollable range", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const container = mount(() => <ScrollAreaScrollbar scrollArea={scrollArea} id="sb" class="s" />);
    const bar = container.querySelector('[role="scrollbar"]');
    expect(bar?.id).toBe("sb");
    expect(bar?.className).toBe("s");
    expect(bar?.getAttribute("aria-orientation")).toBe("vertical");
    expect(bar?.getAttribute("data-orientation")).toBe("vertical");
    expect(bar?.getAttribute("aria-valuenow")).toBe("0");
    expect(bar?.getAttribute("aria-valuemin")).toBe("0");
    expect(bar?.getAttribute("aria-valuemax")).toBe("100");
  });

  it("supports explicit horizontal orientation", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    const container = mount(() => <ScrollAreaScrollbar scrollArea={scrollArea} orientation="horizontal" />);
    const bar = container.querySelector('[role="scrollbar"]');
    expect(bar?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(bar?.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("computes aria-valuenow as a percentage of the scrollable range", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({ scrollTop: 150, scrollLeft: 0, scrollHeight: 800, clientHeight: 300 } as HTMLElement);
    // range = 800 - 300 = 500; 150/500 * 100 = 30
    const container = mount(() => <ScrollAreaScrollbar scrollArea={scrollArea} />);
    const bar = container.querySelector('[role="scrollbar"]');
    expect(bar?.getAttribute("aria-valuenow")).toBe("30");
  });

  it("clamps to 0% when the scrollable range is negative (clientHeight > scrollHeight)", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({ scrollTop: 0, scrollLeft: 0, scrollHeight: 100, clientHeight: 300 } as HTMLElement);
    const container = mount(() => <ScrollAreaScrollbar scrollArea={scrollArea} />);
    const bar = container.querySelector('[role="scrollbar"]');
    expect(bar?.getAttribute("aria-valuenow")).toBe("0");
  });

  it("computes horizontal aria-valuenow from scrollLeft/scrollWidth, not the vertical metrics", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({
      scrollTop: 999,
      scrollLeft: 120,
      scrollHeight: 999,
      clientHeight: 999,
      scrollWidth: 600,
      clientWidth: 200,
    } as HTMLElement);
    // horizontal range = 600 - 200 = 400; 120/400 * 100 = 30
    const container = mount(() => <ScrollAreaScrollbar scrollArea={scrollArea} orientation="horizontal" />);
    const bar = container.querySelector('[role="scrollbar"]');
    expect(bar?.getAttribute("aria-valuenow")).toBe("30");
  });
});

describe("ScrollAreaThumb", () => {
  it("renders a div with id and class", () => {
    const container = mount(() => <ScrollAreaThumb id="thumb-1" class="th" />);
    const thumb = container.querySelector("#thumb-1");
    expect(thumb?.className).toBe("th");
  });

  it("defaults to a full-size, unoffset thumb when no scrollArea is given", () => {
    const container = mount(() => <ScrollAreaThumb id="thumb-bare" />);
    const thumb = container.querySelector("#thumb-bare") as HTMLElement;
    expect(thumb.style.getPropertyValue("--morphos-thumb-size")).toBe("100%");
    expect(thumb.style.getPropertyValue("--morphos-thumb-offset")).toBe("0%");
  });

  it("sizes the vertical thumb proportionally to clientHeight/scrollHeight", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({ scrollTop: 0, scrollLeft: 0, scrollHeight: 800, clientHeight: 200 } as HTMLElement);
    const container = mount(() => <ScrollAreaThumb id="thumb-v" scrollArea={scrollArea} />);
    const thumb = container.querySelector("#thumb-v") as HTMLElement;
    // 200/800 * 100 = 25
    expect(thumb.style.getPropertyValue("--morphos-thumb-size")).toBe("25%");
  });

  it("offsets the vertical thumb within the remaining track space as scrollTop advances", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    // range = 800 - 200 = 600; scrolled halfway = 300; size = 25%
    // offset = 300/600 * (100 - 25) = 37.5
    scrollArea._onScroll({ scrollTop: 300, scrollLeft: 0, scrollHeight: 800, clientHeight: 200 } as HTMLElement);
    const container = mount(() => <ScrollAreaThumb id="thumb-v2" scrollArea={scrollArea} />);
    const thumb = container.querySelector("#thumb-v2") as HTMLElement;
    expect(thumb.style.getPropertyValue("--morphos-thumb-offset")).toBe("37.5%");
  });

  it("sizes and offsets the horizontal thumb using scrollWidth/clientWidth/scrollLeft instead of the vertical metrics", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({
      scrollTop: 999,
      scrollLeft: 150,
      scrollHeight: 999,
      clientHeight: 999,
      scrollWidth: 600,
      clientWidth: 200,
    } as HTMLElement);
    const container = mount(() => (
      <ScrollAreaThumb id="thumb-h" scrollArea={scrollArea} orientation="horizontal" />
    ));
    const thumb = container.querySelector("#thumb-h") as HTMLElement;
    // size = 200/600 * 100 = 33.333...%; range = 400; offset = 150/400 * (100-33.33) = 25%
    expect(thumb.style.getPropertyValue("--morphos-thumb-size")).toBe(`${String((200 / 600) * 100)}%`);
    expect(thumb.style.getPropertyValue("--morphos-thumb-offset")).toBe("25%");
  });

  it("clamps size to 100% and offset to 0% when there is no scrollable range", () => {
    const scrollArea = new ScrollArea();
    scrollArea.onBeforeMount?.();
    scrollArea._onScroll({ scrollTop: 0, scrollLeft: 0, scrollHeight: 100, clientHeight: 300 } as HTMLElement);
    const container = mount(() => <ScrollAreaThumb id="thumb-over" scrollArea={scrollArea} />);
    const thumb = container.querySelector("#thumb-over") as HTMLElement;
    expect(thumb.style.getPropertyValue("--morphos-thumb-size")).toBe("100%");
    expect(thumb.style.getPropertyValue("--morphos-thumb-offset")).toBe("0%");
  });
});
