import { Select, Text, TextField } from "@radix-ui/themes";
import { Controller } from "react-hook-form";

import { onInputChange } from "@/utils/form";
import { resolveSpacing } from "@/utils/style";
import { TERMINAL_THEMES } from "../XTerminal/themes";
import styles from "./TerminalSettingsForm.module.less";
import type { EditHostFormApi } from "./types";

type TerminalSettingsFormProps = {
  formApi: EditHostFormApi;
  sx?: unknown;
};

export default function TerminalSettingsForm({
  formApi,
  sx,
}: TerminalSettingsFormProps) {
  const wrapperStyle = resolveSpacing(sx);

  return (
    <section className={styles.section} style={wrapperStyle}>
      <div className={styles.sectionTitleWrap}>
        <Text size="3" weight="medium">
          Настройки терминала
        </Text>
      </div>

      <Controller
        name="terminalSettings.fontFamily"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите семейство шрифтов",
          },
        }}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <Text
              as="label"
              size="2"
              weight="medium"
              className={styles.fieldLabel}
            >
              Семейство шрифтов
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Семейство шрифтов"
              onChange={onInputChange(field.onChange)}
            />
            {fieldState.invalid && (
              <Text size="1" className={styles.errorHint}>
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="terminalSettings.fontSize"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите размер шрифта",
          },
          pattern: {
            value: /^\d+$/,
            message: "Введите число",
          },
          min: {
            value: 10,
            message: "Размер шрифта не может быть меньше 10",
          },
          max: {
            value: 48,
            message: "Размер шрифта не может быть больше 48",
          },
        }}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <Text
              as="label"
              size="2"
              weight="medium"
              className={styles.fieldLabel}
            >
              Размер шрифта
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Размер шрифта"
              type="number"
              onChange={onInputChange(field.onChange)}
            />
            {fieldState.invalid && (
              <Text size="1" className={styles.errorHint}>
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="terminalSettings.theme"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите тему",
          },
        }}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <Text
              as="label"
              size="2"
              weight="medium"
              className={styles.fieldLabel}
            >
              Тема
            </Text>
            <Select.Root
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <Select.Trigger
                style={{ width: "100%" }}
                placeholder="Выберите тему"
              />
              <Select.Content>
                {TERMINAL_THEMES.map((item) => (
                  <Select.Item key={item.name} value={item.name}>
                    {item.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {fieldState.invalid && (
              <Text size="1" className={styles.errorHint}>
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />
    </section>
  );
}
