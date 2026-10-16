// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { setReactiveObserver } from "@praxisjs/core/internal";
import { render } from "@praxisjs/runtime";

import { Radio } from "../radio/radio";
import { RadioGroup } from "../radio/radio-group";

afterEach(() => {
  document.body.innerHTML = "";
});

function countEffects(fn: () => void): number {
  let runs = 0;
  setReactiveObserver({ effect() { runs++; } });
  try {
    fn();
  } finally {
    setReactiveObserver(null);
  }
  return runs;
}

describe("RadioGroup selection updates", () => {
  it("selecting a radio runs the same effects for 4 or 40 radios", () => {
    const runsFor = (count: number) => {
      const group = new RadioGroup();
      group.onBeforeMount();
      group.select("v0");
      const container = document.createElement("div");
      document.body.appendChild(container);
      render(() => (
        <div>
          {Array.from({ length: count }, (_, i) => <Radio group={group} value={`v${String(i)}`} />)}
        </div>
      ) as Node, container);
      const runs = countEffects(() => { group.select("v2"); });
      const checked = [...container.querySelectorAll("input")].filter((input) => input.checked);
      expect(checked.map((input) => input.value)).toEqual(["v2"]);
      expect(container.querySelectorAll("[data-checked]")).toHaveLength(1);
      return runs;
    };
    expect(runsFor(40)).toBe(runsFor(4));
  });
});
