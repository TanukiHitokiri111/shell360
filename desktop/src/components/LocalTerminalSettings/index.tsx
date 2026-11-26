import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { onInputChange, TERMINAL_THEMES } from "shared";
import { useLocalTerminalSettings } from "@/atoms/localTerminalSettings.atom";

type FormValues = {
  fontFamily: string;
  fontSize: string;
  theme: string;
  shell: string;
};

type LocalTerminalSettingsDialogProps = {
  open: boolean;
  onCancel: () => void;
};

export default function LocalTerminalSettingsDialog({
  open,
  onCancel,
}: LocalTerminalSettingsDialogProps) {
  const [settings, updateSettings] = useLocalTerminalSettings();

  const formApi = useForm<FormValues>({
    defaultValues: {
      fontFamily: settings.fontFamily,
      fontSize: String(settings.fontSize),
      theme: settings.theme,
      shell: settings.shell,
    },
  });

  useEffect(() => {
    if (open) {
      formApi.reset({
        fontFamily: settings.fontFamily,
        fontSize: String(settings.fontSize),
        theme: settings.theme,
        shell: settings.shell,
      });
    }
  }, [open, settings, formApi]);

  const onSubmit = formApi.handleSubmit((data) => {
    updateSettings({
      fontFamily: data.fontFamily,
      fontSize: Number(data.fontSize),
      theme: data.theme,
      shell: data.shell,
    });
    onCancel();
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <Dialog.Content style={{ maxWidth: 420 }}>
        <Dialog.Title>Настройки локального терминала</Dialog.Title>
        <Dialog.Description size="2" color="gray">
          Настройте шрифт, тему и оболочку встроенного локального терминала.
        </Dialog.Description>
        <form noValidate autoComplete="off">
          <Flex direction="column" gap="4" mt="4">
            <Controller
              name="fontFamily"
              control={formApi.control}
              rules={{
                required: { value: true, message: "Введите семейство шрифтов" },
              }}
              render={({ field, fieldState }) => (
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Семейство шрифтов
                  </Text>
                  <TextField.Root
                    value={field.value}
                    placeholder="Семейство шрифтов"
                    onChange={onInputChange(field.onChange)}
                  />
                  {fieldState.invalid && (
                    <Text size="1" color="red">
                      {fieldState.error?.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Controller
              name="fontSize"
              control={formApi.control}
              rules={{
                required: { value: true, message: "Введите размер шрифта" },
                pattern: { value: /^\d+$/, message: "Введите число" },
                min: { value: 10, message: "Минимальный размер шрифта — 10" },
                max: { value: 48, message: "Максимальный размер шрифта — 48" },
              }}
              render={({ field, fieldState }) => (
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Размер шрифта
                  </Text>
                  <TextField.Root
                    value={field.value}
                    placeholder="Размер шрифта"
                    type="number"
                    onChange={onInputChange(field.onChange)}
                  />
                  {fieldState.invalid && (
                    <Text size="1" color="red">
                      {fieldState.error?.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Controller
              name="theme"
              control={formApi.control}
              rules={{
                required: { value: true, message: "Выберите тему" },
              }}
              render={({ field, fieldState }) => (
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Тема
                  </Text>
                  <Select.Root
                    value={field.value}
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
                    <Text size="1" color="red">
                      {fieldState.error?.message}
                    </Text>
                  )}
                </Flex>
              )}
            />

            <Controller
              name="shell"
              control={formApi.control}
              render={({ field }) => (
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Путь к оболочке
                  </Text>
                  <TextField.Root
                    value={field.value}
                    placeholder="Автоопределение (powershell / zsh / bash)"
                    onChange={onInputChange(field.onChange)}
                  />
                  <Text size="1" color="gray">
                    Оставьте пустым для автоопределения по ОС.
                  </Text>
                </Flex>
              )}
            />
          </Flex>
        </form>
        <Flex gap="3" justify="end" mt="4">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={onSubmit}>Сохранить</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
