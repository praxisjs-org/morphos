import { StatefulComponent } from "@praxisjs/core";
import { Component, Computed, Prop } from "@praxisjs/decorators";

@Component()
export class Progress extends StatefulComponent {
  @Prop() value?: number;
  @Prop() max = 100;
  @Prop() min = 0;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;

  get isIndeterminate(): boolean {
    return this.value === undefined;
  }

  @Computed()
  get percentage(): number | undefined {
    if (this.value === undefined) return undefined;
    return Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
  }

  render() {
    return (
      <div
        id={this.id}
        role="progressbar"
        class={this.class}
        aria-valuemin={() => this.min}
        aria-valuemax={() => this.max}
        aria-valuenow={() => (this.isIndeterminate ? undefined : this.value)}
        aria-valuetext={() => (this.isIndeterminate ? undefined : `${String(this.percentage)}%`)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-indeterminate={() => (this.isIndeterminate ? "" : undefined)}
        data-value={() => (this.isIndeterminate ? undefined : String(this.value))}
        style={() => ({ "--progress": this.isIndeterminate ? undefined : `${String(this.percentage)}%` })}
      />
    );
  }
}
