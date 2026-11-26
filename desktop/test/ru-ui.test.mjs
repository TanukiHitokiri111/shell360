import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("desktop navigation exposes Russian labels without changing routes", () => {
  const source = read("../src/config/pages.ts");
  for (const [path, label] of [
    ["/", "Хосты"],
    ["/port-forwardings", "Туннели"],
    ["/keys", "Ключи"],
    ["/known-hosts", "Известные хосты"],
    ["/settings", "Настройки"],
  ]) {
    assert.match(
      source,
      new RegExp(`path: "${path}"[\\s\\S]*?label: "${label}"`),
    );
  }
});

test("settings warn in Russian before overwriting imported data", () => {
  const source = read("../src/routes/Settings/index.tsx");
  assert.match(source, /Импорт.*перезапишет/);
  assert.match(source, /cancelText: "Отмена"/);
});

test("shared host and key forms present Russian labels and validation", () => {
  for (const path of ["../../packages/shared/src/components/EditHostForm/BasicForm.tsx", "../../packages/shared/src/components/EditKeyForm/index.tsx", "../../packages/shared/src/components/GenerateKeyForm/index.tsx"]) {
    const source = read(path);
    assert.doesNotMatch(source, /message: "Please /);
    assert.match(source, /placeholder="Название"/);
  }
});

test("terminal settings and SFTP controls are Russian", () => {
  assert.match(read("../src/components/LocalTerminalSettings/index.tsx"), /Настройки локального терминала/);
  assert.match(read("../src/components/SftpBrowser/SftpBreadcrumbs/index.tsx"), /placeholder="Введите путь/);
});
