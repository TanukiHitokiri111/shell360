import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
test("shared connection and transfer UI uses Russian while retaining protocol keys", () => {
  const form = read(
    "../../packages/shared/src/components/PortForwardingForm/index.tsx",
  );
  assert.match(form, /Локальный туннель/);
  assert.match(form, /value: PortForwardingType.Local/);
  const transfer = read(
    "../../packages/shared/src/components/TransferProgress/index.tsx",
  );
  assert.match(transfer, /Передачи/);
  assert.match(transfer, /item.status === "transferring"/);
  assert.match(
    read(
      "../../packages/shared/src/components/SSHLoading/UnknownKey/index.tsx",
    ),
    /Продолжить/,
  );
  assert.match(
    read("../src/components/Workspace/index.tsx"),
    /Нет открытых терминалов/,
  );
});

test("desktop delete confirmations are Russian", () => {
  for (const path of [
    "../src/routes/Hosts/index.tsx",
    "../src/routes/Keys/index.tsx",
    "../src/routes/KnownHosts/index.tsx",
    "../src/routes/PortForwardings/usePortForwardingRuntime.ts",
  ]) {
    assert.doesNotMatch(read(path), /Are you sure to delete/);
  }
});
