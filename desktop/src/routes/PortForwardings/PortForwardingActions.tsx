import { Button, Flex } from "@radix-ui/themes";
import clsx from "clsx";
import styles from "./index.module.less";

type PortForwardingActionsProps = {
  isRunning: boolean;
  variant: "card" | "row";
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
};

export default function PortForwardingActions({
  isRunning,
  variant,
  onDelete,
  onEdit,
  onToggle,
}: PortForwardingActionsProps) {
  const containerClass = variant === "card" ? styles.cardActions : undefined;
  const actionClass = variant === "card" ? styles.primaryBtn : undefined;
  const dangerClass = variant === "card" ? styles.dangerBtn : undefined;
  const deleteClass = variant === "card" ? styles.dangerBtn : undefined;

  return variant === "card" ? (
    <div className={containerClass}>
      <button
        type="button"
        className={clsx(actionClass, isRunning && dangerClass)}
        onClick={onToggle}
      >
        {isRunning ? "Остановить" : "Запустить"}
      </button>
      <button type="button" className={actionClass} onClick={onEdit}>
        Изменить
      </button>
      <button type="button" className={deleteClass} onClick={onDelete}>
        Удалить
      </button>
    </div>
  ) : (
    <Flex gap="1">
      <Button size="1" variant="ghost" type="button" onClick={onToggle}>
        {isRunning ? "Остановить" : "Запустить"}
      </Button>
      <Button size="1" variant="ghost" type="button" onClick={onEdit}>
        Изменить
      </Button>
      <Button
        size="1"
        variant="ghost"
        color="red"
        type="button"
        onClick={onDelete}
      >
        Удалить
      </Button>
    </Flex>
  );
}
