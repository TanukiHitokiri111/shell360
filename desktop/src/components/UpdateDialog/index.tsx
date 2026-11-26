import { Button, Callout, Dialog, Progress } from "@radix-ui/themes";
import dayjs from "dayjs";
import { useMemo } from "react";
import { CloseIcon } from "shared";
import { useUpdateAtom } from "@/atoms/update.atom";
import styles from "./index.module.less";

export default function UpdateDialog() {
  const {
    openUpdateDialog,
    setOpenUpdateDialog,
    update,
    isDownloading,
    error,
    total,
    downloaded,
    download,
    install,
  } = useUpdateAtom();

  const progress = useMemo(() => {
    if (!total) {
      return 0;
    }

    return Math.min(Math.floor(((downloaded || 0) / total) * 100), 100);
  }, [total, downloaded]);

  const isDownloadSuccess = progress === 100 && !error;
  const shouldShowProgress = isDownloading || progress > 0 || !!error;

  const nextVersion = useMemo(() => {
    const value = update?.version;
    return value?.trim() ? value.trim() : "--";
  }, [update]);

  const currentVersion = useMemo(() => {
    const value = update?.currentVersion;
    return value?.trim() ? value.trim() : "--";
  }, [update]);

  const publishedAt = useMemo(() => {
    const rawValue = update?.date;

    if (typeof rawValue === "string") {
      const parsed = dayjs(rawValue);

      if (parsed.isValid()) {
        return parsed.format("YYYY-MM-DD HH:mm");
      }
    }

    return "--";
  }, [update]);

  const releaseNotes = useMemo(() => {
    const value = update?.body?.trim();
    return value || "Для этого обновления нет описания изменений.";
  }, [update]);

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }

    const fixed =
      value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1);
    return `${fixed} ${units[index]}`;
  };

  const downloadedText = `${formatBytes(downloaded)} / ${formatBytes(total)}`;
  const progressLabel = isDownloadSuccess
    ? "Загрузка завершена"
    : isDownloading
      ? "Загрузка обновления"
      : error
        ? "Ошибка загрузки"
        : "Готово к загрузке";

  return (
    <Dialog.Root open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
      <Dialog.Content className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <div className={styles.titleArea}>
              <Dialog.Title className={styles.title}>
                {isDownloadSuccess ? "Обновление готово" : "Доступна новая версия"}
              </Dialog.Title>
              <Dialog.Description className={styles.subtitle}>
                {isDownloadSuccess
                  ? 'Обновление загружено. Нажмите «Установить», чтобы применить изменения.'
                  : "Доступна новая версия приложения. Загрузите её, чтобы получить последние улучшения."}
              </Dialog.Description>
            </div>
            <button
              type="button"
              aria-label="Закрыть"
              className={styles.closeBtn}
              onClick={() => setOpenUpdateDialog(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.versionRow}>
            <div className={styles.versionCell}>
              <span className={styles.versionLabel}>Текущая</span>
              <span className={styles.versionValue}>{currentVersion}</span>
            </div>
            <div className={styles.versionCell}>
              <span className={styles.versionLabel}>Последняя</span>
              <span className={styles.versionValue}>{nextVersion}</span>
            </div>
            <div className={styles.versionCell}>
              <span className={styles.versionLabel}>Опубликовано</span>
              <span className={styles.versionValue}>{publishedAt}</span>
            </div>
          </div>

          {shouldShowProgress && (
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <span className={styles.progressStatus}>{progressLabel}</span>
                <span className={styles.progressPercent}>{progress}%</span>
              </div>
              <Progress value={progress} max={100} />
              <div className={styles.progressSize}>{downloadedText}</div>
            </div>
          )}

          <div className={styles.sectionLabel}>Описание изменений</div>
          <div className={styles.notesBox}>{releaseNotes}</div>

          {!!error && (
            <div className={styles.errorBox}>
              <Callout.Root color="red" role="alert">
                <Callout.Text>{String(error)}</Callout.Text>
              </Callout.Root>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            variant="outline"
            disabled={isDownloading}
            onClick={() => setOpenUpdateDialog(false)}
          >
            Отмена
          </Button>
          {isDownloadSuccess ? (
            <Button onClick={install}>Установить</Button>
          ) : (
            <Button disabled={isDownloading} onClick={download}>
              Загрузить
            </Button>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
