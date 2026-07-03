import { StatefulComponent } from "@praxisjs/core";
import { Component, Computed, Prop } from "@praxisjs/decorators";

@Component()
export class Meter extends StatefulComponent {
  @Prop() value!: number;
  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() low?: number;
  @Prop() high?: number;
  @Prop() optimum?: number;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;

  @Computed()
  get percentage(): number {
    return Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
  }

  get isLow(): boolean {
    return this.low !== undefined && this.value < this.low;
  }

  get isHigh(): boolean {
    return this.high !== undefined && this.value > this.high;
  }

  get isOptimum(): boolean {
    return this.optimum !== undefined && this.value === this.optimum;
  }

  render() {
    return (
      <div
        id={this.id}
        class={this.class}
        role="meter"
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-valuenow={() => this.value}
        aria-valuemin={() => this.min}
        aria-valuemax={() => this.max}
        data-value={() => String(this.value)}
        data-low={() => (this.isLow ? "" : undefined)}
        data-high={() => (this.isHigh ? "" : undefined)}
        data-optimum={() => (this.isOptimum ? "" : undefined)}
        style={() => ({ "--meter-value": `${String(this.percentage)}%` })}
      >
        <div data-meter-fill="" />
      </div>
    );
  }
}
