import type { ComponentType } from "react";

export type TabItem = {
  id: string;
  label: string;
  component: ComponentType;
};
