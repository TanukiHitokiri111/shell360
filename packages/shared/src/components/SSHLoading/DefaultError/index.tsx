import { get } from "lodash-es";
import { type ErrorProps, StatusButton } from "../common";
import ErrorText from "../ErrorText";
import styles from "../styles.module.less";

export default function DefaultError({ error, onClose, onRetry }: ErrorProps) {
  return (
    <>
      <ErrorText
        title="Не удалось подключиться"
        message={get(error, "message", String(error))}
      />
      <div className={styles.actions}>
        <StatusButton variant="outlined" onClick={onClose}>
          Закрыть
        </StatusButton>
        <StatusButton variant="contained" onClick={onRetry}>
          Повторить
        </StatusButton>
      </div>
    </>
  );
}
