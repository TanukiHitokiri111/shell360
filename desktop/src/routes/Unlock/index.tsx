import { Button, Heading, Spinner, Text } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import { loadCryptoByPassword, resetCrypto } from "bridge/data";
import { type KeyboardEvent, useCallback, useState } from "react";
import { LockIcon, TextFieldPassword } from "shared";
import useMessage from "@/hooks/useMessage";
import useModal from "@/hooks/useModal";
import styles from "./index.module.less";

export default function Unlock() {
  const [password, setPassword] = useState("");
  const message = useMessage();
  const modal = useModal();

  const { run: onUnlock, loading: loadCryptoLoading } = useRequest(
    () => loadCryptoByPassword({ password }),
    {
      manual: true,
      onError: () => {
        message.error({
          message: "Не удалось разблокировать приложение. Проверьте пароль",
        });
      },
    },
  );

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.code === "Enter") {
        onUnlock();
      }
    },
    [onUnlock],
  );

  const { run: onReset, loading: resetLoading } = useRequest(
    async () => {
      const isContinue = await new Promise((resolve) => {
        modal.confirm({
          title: <span>Предупреждение</span>,
          content:
            "Все данные приложения будут сброшены. Продолжить?",
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });

      if (!isContinue) {
        return;
      }

      return resetCrypto();
    },
    {
      manual: true,
      onError: () => {
        message.error({
          message: "Не удалось сбросить данные приложения",
        });
      },
    },
  );

  const loading = loadCryptoLoading || resetLoading;

  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        {loading && (
          <div className={styles.overlay}>
            <Spinner size="3" />
          </div>
        )}
        <div className={styles.iconWrap}>
          <LockIcon />
        </div>
        <Heading size="5" align="center" as="h2">
          Приложение заблокировано
        </Heading>
        <Text
          as="p"
          size="2"
          align="center"
          color="gray"
          className={styles.hint}
        >
          Введите пароль для разблокировки
        </Text>
        <div className={styles.passwordWrap}>
          <TextFieldPassword
            fullWidth
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={onEnter}
            disabled={loading}
          />
        </div>
        <div className={styles.actions}>
          <Button
            style={{ width: "100%" }}
            onClick={onUnlock}
            disabled={loading}
          >
            {loadCryptoLoading && <Spinner />}
            {loadCryptoLoading ? "Разблокировка..." : "Разблокировать"}
          </Button>
        </div>
        <div className={styles.resetWrap}>
          <Button
            variant="ghost"
            color="gray"
            size="1"
            onClick={onReset}
            disabled={loading}
          >
            Сбросить все данные
          </Button>
        </div>
      </div>
    </div>
  );
}
