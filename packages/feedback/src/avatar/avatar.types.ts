import type { PrimitiveProps } from "@morphos/core";

import type { Avatar } from "./avatar";

export type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

export type AvatarProps = PrimitiveProps;

export interface AvatarImageProps {
  avatar: Avatar;
  src: string;
  alt: string;
  class?: string;
}

export interface AvatarFallbackProps extends PrimitiveProps {
  avatar: Avatar;
}
