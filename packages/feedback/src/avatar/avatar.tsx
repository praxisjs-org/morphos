import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";

import type { AvatarFallbackProps, AvatarImageStatus, AvatarProps } from "./avatar.types";

@Component()
export class Avatar extends StatefulComponent {
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: AvatarProps["children"];

  @State() _imageStatus: AvatarImageStatus = "idle";

  onBeforeMount() {
    this._imageStatus = "idle";
  }

  setImageStatus(status: AvatarImageStatus) {
    this._imageStatus = status;
  }

  get imageLoaded(): boolean {
    return this._imageStatus === "loaded";
  }

  get imageError(): boolean {
    return this._imageStatus === "error";
  }

  render() {
    return (
      <span
        id={this.id}
        class={this.class}
        data-status={() => this._imageStatus}
      >
        {this.children}
      </span>
    );
  }
}

@Component()
export class AvatarImage extends StatefulComponent {
  @Prop() avatar!: Avatar;
  @Prop() src!: string;
  @Prop() alt!: string;
  @Prop() class?: string;

  onMount() {
    this.avatar.setImageStatus("loading");
  }

  render() {
    return (
      <img
        src={this.src}
        alt={this.alt}
        class={this.class}
        hidden={() => !this.avatar.imageLoaded}
        onLoad={() => { this.avatar.setImageStatus("loaded"); }}
        onError={() => { this.avatar.setImageStatus("error"); }}
      />
    );
  }
}

@Component()
export class AvatarFallback extends StatelessComponent<AvatarFallbackProps> {
  render() {
    const { avatar, children, class: cls, id } = this.props;

    return (
      <span
        id={id}
        class={cls}
        hidden={() => avatar.imageLoaded}
      >
        {children}
      </span>
    );
  }
}
