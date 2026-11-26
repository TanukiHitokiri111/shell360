import { Button, Flex } from "@radix-ui/themes";
import { ask } from "bridge/dialog";
import { getCurrentWindow } from "bridge/window";
import { get } from "lodash-es";
import { useCallback } from "react";
import styles from "./index.module.less";

type AbnormalProps = {
  error?: unknown;
  resetErrorBoundary?: () => unknown;
};

export default function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: AbnormalProps) {
  const onReset = useCallback(async () => {
    const answer = await ask(
      "Все настройки приложения будут удалены. Продолжить?",
      {
        title: "Предупреждение",
        kind: "warning",
      },
    );

    if (answer) {
      window.localStorage.clear();
      window.location.reload();
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.eyesWrap}>
        <div className={styles.eyes}>
          <span className={styles.eye}>
            <span className={styles.eyeball} />
          </span>
          <span className={styles.eye}>
            <span className={styles.eyeball} />
          </span>
        </div>
      </div>
      <div className={styles.titleWrap}>
        <h1 className={styles.title}>Произошла ошибка</h1>
      </div>
      <div className={styles.messageWrap}>
        <p className={styles.message}>{get(error, "message", String(error))}</p>
      </div>
      <Flex
        align="center"
        justify="center"
        gap="3"
        style={{ maxWidth: 420, margin: "0 auto" }}
      >
        <Button style={{ flex: 1 }} onClick={resetErrorBoundary}>
          Повторить
        </Button>
        <Button style={{ flex: 1 }} color="red" onClick={onReset}>
          Сбросить
        </Button>
        <Button
          style={{ flex: 1 }}
          color="amber"
          onClick={() => getCurrentWindow().close()}
        >
          Выход
        </Button>
      </Flex>
    </div>
  );
}
