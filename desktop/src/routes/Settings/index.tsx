import {
  Button,
  Card,
  Flex,
  Heading,
  RadioCards,
  Spinner,
  Switch,
  Text,
} from "@radix-ui/themes";
import { getVersion } from "bridge/app";
import { changeCryptoEnable } from "bridge/data";
import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  type Appearance,
  FileDownloadIcon,
  FileIcon,
  FileUploadIcon,
  HostIcon,
  KeyIcon,
  TerminalIcon,
  UpgradeIcon,
  useAppearance,
  WarningCircleIcon,
} from "shared";
import {
  cryptoIsEnableAtom,
  useUpdateCryptoIsEnable,
} from "@/atoms/crypto.atom";
import { useLocalTerminalSettings } from "@/atoms/localTerminalSettings.atom";
import { useUpdateAtom } from "@/atoms/update.atom";
import ChangeCryptoPassword from "@/components/ChangeCryptoPassword";
import InitCrypto from "@/components/InitCrypto";
import LocalTerminalSettingsDialog from "@/components/LocalTerminalSettings";
import useExportData from "@/hooks/useExportData";
import useImportData from "@/hooks/useImportData";
import useMessage from "@/hooks/useMessage";
import useModal from "@/hooks/useModal";
import openUrl from "@/utils/openUrl";
import styles from "./index.module.less";

type SectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

type ActionRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  value?: ReactNode;
  cta?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    tone?: "default" | "primary";
  };
  footer?: ReactNode;
};

const APPEARANCE_OPTIONS: Array<{
  value: Appearance;
  label: string;
  hint: string;
}> = [
  {
    value: "inherit",
    label: "Как в системе",
    hint: "Автоматически использовать системную тему.",
  },
  { value: "light", label: "Светлая", hint: "Светлое оформление." },
  {
    value: "dark",
    label: "Тёмная",
    hint: "Тёмное оформление для длительной работы.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: Omit<SectionProps, "children">) {
  return (
    <div className={styles.sectionHeader}>
      <Text as="p" className={styles.sectionEyebrow}>
        {eyebrow}
      </Text>
      <Heading size="4" className={styles.sectionTitle}>
        {title}
      </Heading>
      <Text as="p" className={styles.sectionDescription}>
        {description}
      </Text>
    </div>
  );
}

function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <div className={styles.section}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <Card variant="surface">{children}</Card>
    </div>
  );
}

function ActionRow({
  icon,
  title,
  description,
  value,
  cta,
  footer,
}: ActionRowProps) {
  return (
    <div className={styles.actionRow}>
      <Flex
        align={{ initial: "start", sm: "center" }}
        direction={{ initial: "column", sm: "row" }}
        justify="between"
        gap="4"
        className={styles.actionRowInner}
      >
        <div className={styles.actionMain}>
          <span className={styles.actionIcon}>{icon}</span>
          <div className={styles.actionText}>
            <Text as="p" className={styles.actionTitle}>
              {title}
            </Text>
            <Text as="p" className={styles.actionDescription}>
              {description}
            </Text>
          </div>
        </div>
        <div className={styles.actionMeta}>
          {value}
          {cta && (
            <Button
              size="2"
              variant={cta.tone === "primary" ? "solid" : "soft"}
              onClick={cta.onClick}
              disabled={cta.disabled}
            >
              {cta.label}
            </Button>
          )}
        </div>
      </Flex>
      {footer}
    </div>
  );
}

export default function Settings() {
  const [version, setVersion] = useState<string>();
  const [appearance, setAppearance] = useAppearance();
  const cryptoEnable = !!useAtomValue(cryptoIsEnableAtom);
  const updateCryptoIsEnable = useUpdateCryptoIsEnable();
  const { hasUpdate, checking, checkUpdate, setOpenUpdateDialog } =
    useUpdateAtom();
  const [localSettings] = useLocalTerminalSettings();
  const exportData = useExportData();
  const importData = useImportData();
  const message = useMessage();
  const modal = useModal();

  const [checkingError, setCheckingError] = useState<string>();
  const [initCryptoIsOpen, setInitCryptoIsOpen] = useState(false);
  const [changeCryptoPasswordIsOpen, setChangeCryptoPasswordIsOpen] =
    useState(false);
  const [terminalSettingsOpen, setTerminalSettingsOpen] = useState(false);

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  const onCryptoEnableChange = useCallback(
    async (checked: boolean) => {
      if (checked) {
        setInitCryptoIsOpen(true);
        return;
      }
      await changeCryptoEnable({ cryptoEnable: false });
      await updateCryptoIsEnable();
    },
    [updateCryptoIsEnable],
  );

  const onCheckUpdate = useCallback(async () => {
    if (hasUpdate) {
      setOpenUpdateDialog(true);
      return;
    }
    setCheckingError(undefined);
    try {
      const result = await checkUpdate();
      if (result) {
        setOpenUpdateDialog(true);
      }
    } catch (error) {
      setCheckingError(String(error));
    }
  }, [checkUpdate, hasUpdate, setOpenUpdateDialog]);

  const onExportData = useCallback(async () => {
    try {
      const ok = await exportData();
      if (!ok) {
        return;
      }
      message.success({
        message: "Данные успешно экспортированы",
      });
    } catch (err) {
      message.error({
        message: `Ошибка экспорта: ${String(err)}`,
      });
    }
  }, [exportData, message]);

  const onImportData = useCallback(async () => {
    try {
      const result = await modal.confirm({
        title: "Предупреждение",
        icon: (
          <WarningCircleIcon
            style={{ fontSize: 32, color: "var(--orange-9)" }}
          />
        ),
        content:
          "Импорт перезапишет совпадающие настройки, что может привести к потере данных. Продолжайте с осторожностью.",
        okText: "Импорт",
        cancelText: "Отмена",
      });
      if (!result) {
        return;
      }
    } catch {
      return;
    }

    try {
      const ok = await importData();
      if (!ok) {
        return;
      }
      message.success({
        message: "Данные успешно импортированы",
      });
    } catch (err) {
      message.error({
        message: `Ошибка импорта: ${String(err)}`,
      });
    }
  }, [modal, importData, message]);

  return (
    <section className={styles.page}>
      <Flex className={styles.header} align="start" justify="between" gap="6">
        <Flex className={styles.headerMain} direction="column" gap="2">
          <Text size="1" color="gray" className={styles.eyebrow}>
            Приложение
          </Text>
          <Heading size="6">Настройки</Heading>
          <Text size="2" color="gray">
            Настройте оформление, терминал, безопасность и обновления
            приложения.
          </Text>
        </Flex>
        <Flex className={styles.headerActions}>
          <button
            type="button"
            className={styles.versionPill}
            data-update={hasUpdate ? "true" : undefined}
            data-error={checkingError ? "true" : undefined}
            onClick={onCheckUpdate}
            title={
              checkingError
                ? checkingError
                : hasUpdate
                  ? "Доступно обновление"
                  : "Проверить обновления"
            }
          >
            <Text as="span" className={styles.versionPillLabel}>
              {version ?? "--"}
            </Text>
            {checkingError ? (
              <WarningCircleIcon className={styles.versionPillStatus} />
            ) : hasUpdate ? (
              <span className={styles.versionPillStatus}>
                <UpgradeIcon />
                Обновить
              </span>
            ) : checking ? (
              <Spinner className={styles.versionPillStatus} />
            ) : (
              <UpgradeIcon className={styles.versionPillStatus} />
            )}
          </button>
        </Flex>
      </Flex>
      <div className={styles.pageBody}>
        <div className={styles.layout}>
          <Section
            eyebrow="Внешний вид"
            title="Оформление"
            description="Выберите оформление приложения."
          >
            <RadioCards.Root
              columns={{ initial: "1", sm: "3" }}
              size="1"
              value={appearance}
              onValueChange={(value) => setAppearance(value as Appearance)}
              className={styles.radioCardsGroup}
            >
              {APPEARANCE_OPTIONS.map((option) => (
                <RadioCards.Item key={option.value} value={option.value}>
                  <Flex direction="column" width="100%">
                    <Text weight="bold">{option.label}</Text>
                    <Text color="gray" size="1" truncate>
                      {option.hint}
                    </Text>
                  </Flex>
                </RadioCards.Item>
              ))}
            </RadioCards.Root>
          </Section>

          <Section
            eyebrow="Терминал"
            title="Локальный"
            description="Настройте шрифт, тему и оболочку встроенного терминала."
          >
            <ActionRow
              icon={<TerminalIcon />}
              title="Настройки локального терминала"
              description={`${localSettings.fontFamily}, ${localSettings.fontSize}px, ${localSettings.theme}${localSettings.shell ? ` — Оболочка: ${localSettings.shell}` : ""}`}
              cta={{
                label: "Настроить",
                onClick: () => setTerminalSettingsOpen(true),
              }}
            />
          </Section>

          <Section
            eyebrow="Безопасность"
            title="Защита данных"
            description="Управление локальным шифрованием и доверенными хостами."
          >
            <ActionRow
              icon={<KeyIcon />}
              title="Локальное шифрование"
              description="Защитите сохранённые данные приложения на этом устройстве."
              value={
                <Switch
                  checked={cryptoEnable}
                  onCheckedChange={onCryptoEnableChange}
                />
              }
            />
            {cryptoEnable && (
              <>
                <div className={styles.actionDivider} />
                <ActionRow
                  icon={<KeyIcon />}
                  title="Изменить пароль шифрования"
                  description="Измените пароль зашифрованных локальных данных."
                  cta={{
                    label: "Изменить",
                    onClick: () => setChangeCryptoPasswordIsOpen(true),
                  }}
                />
              </>
            )}
          </Section>

          <Section
            eyebrow="Данные"
            title="Импорт и экспорт"
            description="Перенос настроек между устройствами."
          >
            <ActionRow
              icon={<FileDownloadIcon />}
              title="Экспорт данных"
              description="Сохранить хосты, ключи и перенаправления портов в файл."
              cta={{
                label: "Экспорт",
                onClick: onExportData,
              }}
            />
            <div className={styles.actionDivider} />
            <ActionRow
              icon={<FileUploadIcon />}
              title="Импорт данных"
              description="Загрузить хосты, ключи и перенаправления портов из файла."
              cta={{
                label: "Импорт",
                onClick: onImportData,
              }}
            />
          </Section>

          <Section
            eyebrow="Приложение"
            title="О приложении"
            description="Ресурсы и ссылки проекта."
          >
            <ActionRow
              icon={<HostIcon />}
              title="Репозиторий проекта"
              description="Открыть репозиторий на GitHub."
              cta={{
                label: "Открыть",
                onClick: () => openUrl("https://github.com/nashaofu/shell360"),
              }}
            />
            <div className={styles.actionDivider} />
            <ActionRow
              icon={<FileIcon />}
              title="Документация"
              description="Открыть README проекта."
              cta={{
                label: "Читать",
                onClick: () =>
                  openUrl(
                    "https://github.com/nashaofu/shell360/blob/master/README.md",
                  ),
              }}
            />
          </Section>
        </div>

        <InitCrypto
          open={initCryptoIsOpen}
          onCancel={() => setInitCryptoIsOpen(false)}
          onOk={() => setInitCryptoIsOpen(false)}
        />
        <ChangeCryptoPassword
          open={changeCryptoPasswordIsOpen}
          onCancel={() => setChangeCryptoPasswordIsOpen(false)}
          onOk={() => setChangeCryptoPasswordIsOpen(false)}
        />
        <LocalTerminalSettingsDialog
          open={terminalSettingsOpen}
          onCancel={() => setTerminalSettingsOpen(false)}
        />
      </div>
    </section>
  );
}
