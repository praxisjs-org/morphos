// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@praxisjs/runtime";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  render(node as () => Node, container);
  return container;
}

describe("Avatar", () => {
  it("starts idle and renders children with id/class", () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    expect(avatar._imageStatus).toBe("idle");
    expect(avatar.imageLoaded).toBe(false);
    expect(avatar.imageError).toBe(false);

    const container = mount(() => (
      <Avatar id="av-1" class="a">
        <em>x</em>
      </Avatar>
    ));
    const root = container.querySelector("#av-1") as HTMLElement;
    expect(root.className).toBe("a");
    expect(root.getAttribute("data-status")).toBe("idle");
    expect(root.querySelector("em")?.textContent).toBe("x");
  });

  it("setImageStatus updates state and the loaded/error getters", () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    avatar.setImageStatus("loaded");
    expect(avatar.imageLoaded).toBe(true);
    expect(avatar.imageError).toBe(false);

    avatar.setImageStatus("error");
    expect(avatar.imageLoaded).toBe(false);
    expect(avatar.imageError).toBe(true);
  });
});

describe("AvatarImage", () => {
  it("sets the avatar status to loading on mount and renders hidden until loaded", async () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    const container = mount(() => (
      <AvatarImage avatar={avatar} src="https://example.com/a.png" alt="Alt text" class="img" />
    ));
    await Promise.resolve();
    expect(avatar._imageStatus).toBe("loading");
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.src).toBe("https://example.com/a.png");
    expect(img.alt).toBe("Alt text");
    expect(img.className).toBe("img");
    expect(img.hidden).toBe(true);
  });

  it("onLoad marks the avatar as loaded, revealing the image", () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    const container = mount(() => <AvatarImage avatar={avatar} src="a.png" alt="a" />);
    const img = container.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("load"));
    expect(avatar._imageStatus).toBe("loaded");
    expect(img.hidden).toBe(false);
  });

  it("onError marks the avatar as errored", () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    const container = mount(() => <AvatarImage avatar={avatar} src="broken.png" alt="a" />);
    const img = container.querySelector("img") as HTMLImageElement;
    img.dispatchEvent(new Event("error"));
    expect(avatar._imageStatus).toBe("error");
    expect(img.hidden).toBe(true);
  });
});

describe("AvatarFallback", () => {
  it("is visible until the image has loaded", () => {
    const avatar = new Avatar();
    avatar.onBeforeMount?.();
    const container = mount(() => (
      <AvatarFallback avatar={avatar} id="fb" class="f">
        AB
      </AvatarFallback>
    ));
    const span = container.querySelector("#fb") as HTMLElement;
    expect(span.className).toBe("f");
    expect(span.hidden).toBe(false);
    expect(span.textContent).toBe("AB");

    avatar.setImageStatus("loaded");
    expect(span.hidden).toBe(true);
  });
});
