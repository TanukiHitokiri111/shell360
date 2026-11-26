import type { SSHSftpFile } from "bridge/ssh";
import { useCallback, useEffect, useState } from "react";
import { CloseIcon, FileIcon } from "shared";
import { getErrorMessage, getSftpBasename } from "../messages";
import useMessage from "../useMessage";
import styles from "./index.module.less";

type FileEditorModalProps = {
  open: boolean;
  file: SSHSftpFile | null;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  onLoadContent: () => Promise<string>;
};

export default function FileEditorModal({
  open,
  file,
  onClose,
  onSave,
  onLoadContent,
}: FileEditorModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const message = useMessage();

  useEffect(() => {
    if (!open || !file) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    onLoadContent()
      .then((fileContent) => {
        if (cancelled) {
          return;
        }
        setContent(fileContent);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        message.error({
          message: `Не удалось загрузить "${getSftpBasename(file.path)}": ${getErrorMessage(err)}`,
        });
        onClose();
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, file, onLoadContent, onClose, message]);

  const filePath = file?.path ?? "";

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave(content);
      message.success({
        message: `Сохранено "${getSftpBasename(filePath)}"`,
      });
      onClose();
    } catch (err: unknown) {
      message.error({
        message: `Не удалось сохранить "${getSftpBasename(filePath)}": ${getErrorMessage(err)}`,
      });
    } finally {
      setSaving(false);
    }
  }, [content, filePath, onSave, onClose, message]);

  const handleCancel = useCallback(() => {
    setContent("");
    onClose();
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <FileIcon />
          <div className={styles.title}>Изменить файл: {file?.name}</div>
          <button
            type="button"
            className={styles.iconButton}
            disabled={saving}
            onClick={handleCancel}
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingWrap}>Загрузка...</div>
          ) : (
            <textarea
              className={styles.editor}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Содержимое файла..."
              disabled={saving}
            />
          )}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleCancel}
            disabled={saving}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
