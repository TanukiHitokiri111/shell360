import {
  FingerprintIcon,
  HostIcon,
  KeyIcon,
  SettingsIcon,
  SiteMapIcon,
} from "shared";

export type PageConfig = {
  path: string;
  label: string;
  Icon: typeof HostIcon;
  section: "main" | "bottom";
};

export const PAGES: PageConfig[] = [
  { path: "/", label: "Хосты", Icon: HostIcon, section: "main" },
  {
    path: "/port-forwardings",
    label: "Туннели",
    Icon: SiteMapIcon,
    section: "main",
  },
  { path: "/keys", label: "Ключи", Icon: KeyIcon, section: "main" },
  {
    path: "/known-hosts",
    label: "Известные хосты",
    Icon: FingerprintIcon,
    section: "main",
  },
  {
    path: "/settings",
    label: "Настройки",
    Icon: SettingsIcon,
    section: "bottom",
  },
];
