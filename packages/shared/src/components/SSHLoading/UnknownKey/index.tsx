import { Button, DropdownMenu } from "@radix-ui/themes";
import { SSHSessionCheckServerKey } from "bridge/ssh";
import { get } from "lodash-es";
import { MoreIcon } from "../../Icon";

import { type ErrorProps, StatusButton } from "../common";
import ErrorText from "../ErrorText";
import styles from "../styles.module.less";

export default function UnknownKey({
  error,
  onReConnect,
  onClose,
}: ErrorProps) {
  return (
    <>
      <ErrorText
        title="Вы уверены, что хотите продолжить?"
        message={get(error, "message", String(error))}
      />

      <div className={styles.actions}>
        <StatusButton variant="outlined" onClick={onClose}>
          Закрыть
        </StatusButton>
        <div className={styles.splitButtonGroup}>
          <Button
            className={styles.splitPrimaryButton}
            onClick={() => onReConnect(SSHSessionCheckServerKey.Continue)}
          >
            Продолжить
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button className={styles.splitMenuButton}>
                <MoreIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="bottom" align="end" sideOffset={4}>
              <DropdownMenu.Item
                onSelect={() =>
                  onReConnect(SSHSessionCheckServerKey.AddAndContinue)
                }
              >
                Добавить и продолжить
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </>
  );
}
