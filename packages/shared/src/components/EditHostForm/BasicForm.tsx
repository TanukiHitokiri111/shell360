import { IconButton, Select, Text, TextField } from "@radix-ui/themes";
import { AuthenticationMethod } from "bridge/data";
import { type KeyboardEvent, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import { useHosts } from "@/hooks/useHosts";
import { useKeys } from "@/hooks/useKeys";
import { validateEnvs } from "@/utils/env";
import { onInputChange } from "@/utils/form";
import { resolveSpacing } from "@/utils/style";

import {
  CodeIcon,
  HostIcon,
  NumberIcon,
  UserIcon,
  VariableIcon,
} from "../Icon";
import { TextFieldPassword } from "../TextFieldPassword";
import styles from "./BasicForm.module.less";
import { TERMINAL_TYPES } from "./terminalTypes";
import type { EditHostFormApi } from "./types";

type BasicFormProps = {
  formApi: EditHostFormApi;
  sx?: unknown;
  onOpenAddKey: () => void;
};

const ADD_KEY_VALUE = "__ADD_KEY__";

export default function BasicForm({
  formApi,
  sx,
  onOpenAddKey,
}: BasicFormProps) {
  const { data: hosts } = useHosts();
  const { data: keys } = useKeys();
  const authenticationMethod = formApi.watch("authenticationMethod");
  const [tagInput, setTagInput] = useState("");
  const [tagInputFocused, setTagInputFocused] = useState(false);

  const wrapperStyle = resolveSpacing(sx);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const host of hosts) {
      if (Array.isArray(host.tags)) {
        for (const tag of host.tags) {
          if (tag?.trim()) {
            set.add(tag.trim());
          }
        }
      }
    }
    return Array.from(set);
  }, [hosts]);

  const onTagsInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    values: string[],
    onChange: (value: string[]) => void,
  ) => {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    const nextTag = tagInput.replace(/,$/, "").trim();
    if (!nextTag || values.includes(nextTag)) {
      setTagInput("");
      return;
    }

    onChange([...values, nextTag]);
    setTagInput("");
  };

  const commitTagInput = (
    values: string[],
    onChange: (value: string[]) => void,
  ) => {
    const nextTag = tagInput.replace(/,$/, "").trim();
    if (nextTag && !values.includes(nextTag)) {
      onChange([...values, nextTag]);
    }
    setTagInput("");
  };

  return (
    <section className={styles.section} style={wrapperStyle}>
      <Controller
        name="name"
        control={formApi.control}
        rules={{
          maxLength: {
            value: 60,
            message: "Введите не более 60 символов",
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
              Название
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Название"
              onChange={onInputChange(field.onChange)}
            />
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="tags"
        control={formApi.control}
        rules={{
          maxLength: {
            value: 60,
            message: "Введите не более 60 символов",
          },
        }}
        render={({ field, fieldState }) => {
          const values = Array.isArray(field.value) ? field.value : [];

          const onRemoveTag = (tag: string) => {
            field.onChange(values.filter((item) => item !== tag));
          };

          const suggestedTags = tags.filter(
            (tag) =>
              !values.includes(tag) &&
              (!tagInput.trim() ||
                tag.toLowerCase().includes(tagInput.toLowerCase().trim())),
          );

          return (
            <div className={styles.formField}>
              <Text
                as="label"
                size="2"
                weight="medium"
                className={styles.fieldLabel}
              >
                Теги
              </Text>
              <div className={styles.tagsFieldWrapper}>
                <div
                  className={`${styles.tagsWrap} ${tagInputFocused ? styles.tagsWrapFocused : ""}`}
                >
                  {values.map((tag) => (
                    <span key={tag} className={styles.tagChip}>
                      {tag}
                      <IconButton
                        type="button"
                        variant="ghost"
                        color="gray"
                        size="1"
                        onClick={() => onRemoveTag(tag)}
                        aria-label="Удалить тег"
                      >
                        ×
                      </IconButton>
                    </span>
                  ))}
                  <input
                    className={styles.tagInput}
                    value={tagInput}
                    placeholder={
                      values.length ? "" : "Введите тег и нажмите Enter"
                    }
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) =>
                      onTagsInputKeyDown(event, values, field.onChange)
                    }
                    onFocus={() => setTagInputFocused(true)}
                    onBlur={() => {
                      setTagInputFocused(false);
                      commitTagInput(values, field.onChange);
                    }}
                  />
                </div>
                {tagInputFocused && suggestedTags.length > 0 && (
                  <div className={styles.tagsSuggestions}>
                    {suggestedTags.map((tag) => (
                      <span
                        key={tag}
                        className={styles.tagSuggestionChip}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          field.onChange([...values, tag]);
                          setTagInput("");
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {fieldState.invalid && (
                <Text size="1" color="red" as="p" mt="1">
                  {fieldState.error?.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <Controller
        name="hostname"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите имя хоста",
          },
          minLength: {
            value: 3,
            message: "Введите не менее 3 символов",
          },
          maxLength: {
            value: 60,
            message: "Введите не более 60 символов",
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
              Имя хоста
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Имя хоста"
              onChange={onInputChange(field.onChange)}
            >
              <TextField.Slot>
                <HostIcon aria-hidden="true" />
              </TextField.Slot>
            </TextField.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="port"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите порт",
          },
          pattern: {
            value: /^\d+$/,
            message: "Введите число",
          },
          min: {
            value: 1,
            message: "Порт не может быть меньше 1",
          },
          max: {
            value: 65535,
            message: "Порт не может быть больше 65535",
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
              Порт
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Порт"
              type="number"
              onChange={onInputChange(field.onChange)}
            >
              <TextField.Slot>
                <NumberIcon aria-hidden="true" />
              </TextField.Slot>
            </TextField.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="username"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите имя пользователя",
          },
          minLength: {
            value: 1,
            message: "Введите не менее 1 символа",
          },
          maxLength: {
            value: 60,
            message: "Введите не более 60 символов",
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
              Имя пользователя
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Имя пользователя"
              onChange={onInputChange(field.onChange)}
            >
              <TextField.Slot>
                <UserIcon aria-hidden="true" />
              </TextField.Slot>
            </TextField.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="authenticationMethod"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите способ аутентификации",
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
              Способ аутентификации
            </Text>
            <Select.Root
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <Select.Trigger
                style={{ width: "100%" }}
                placeholder="Способ аутентификации"
              />
              <Select.Content>
                <Select.Item value={AuthenticationMethod.Password}>
                  Пароль
                </Select.Item>
                <Select.Item value={AuthenticationMethod.PublicKey}>
                  Открытый ключ
                </Select.Item>
                <Select.Item value={AuthenticationMethod.Certificate}>
                  Сертификат
                </Select.Item>
                <Select.Item value={AuthenticationMethod.Agent}>
                  SSH Agent
                </Select.Item>
                <Select.Item value={AuthenticationMethod.KeyboardInteractive}>
                  Интерактивная аутентификация
                </Select.Item>
              </Select.Content>
            </Select.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      {authenticationMethod === AuthenticationMethod.Password && (
        <Controller
          name="password"
          control={formApi.control}
          rules={{
            maxLength: {
              value: 100,
              message: "Введите не более 100 символов",
            },
          }}
          render={({ field, fieldState }) => (
            <div className={styles.formField}>
              <TextFieldPassword
                {...field}
                fullWidth
                label="Пароль"
                placeholder="Пароль"
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            </div>
          )}
        />
      )}

      {(authenticationMethod === AuthenticationMethod.PublicKey ||
        authenticationMethod === AuthenticationMethod.Certificate) && (
        <Controller
          name="keyId"
          control={formApi.control}
          rules={{
            required: {
              value: true,
              message: "Выберите ключ",
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
                Ключ
              </Text>
              <Select.Root
                value={field.value || ""}
                onValueChange={(value) => {
                  if (value === ADD_KEY_VALUE) {
                    onOpenAddKey();
                    return;
                  }
                  field.onChange(value);
                }}
              >
                <Select.Trigger style={{ width: "100%" }} placeholder="Ключ" />
                <Select.Content>
                  <Select.Item value={ADD_KEY_VALUE}>+ Добавить ключ</Select.Item>
                  {keys.map((item) => (
                    <Select.Item key={item.id} value={item.id}>
                      {item.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {fieldState.invalid && (
                <Text size="1" color="red" as="p" mt="1">
                  {fieldState.error?.message}
                </Text>
              )}
            </div>
          )}
        />
      )}

      <Controller
        name="startupCommand"
        control={formApi.control}
        rules={{
          maxLength: {
            value: 500,
            message: "Введите не более 500 символов",
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
              Команда запуска
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Команда после подключения (необязательно)"
              onChange={onInputChange(field.onChange)}
            >
              <TextField.Slot>
                <CodeIcon aria-hidden="true" />
              </TextField.Slot>
            </TextField.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="terminalType"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите тип терминала",
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
              Тип терминала
            </Text>
            <Select.Root
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <Select.Trigger
                style={{ width: "100%" }}
                placeholder="Тип терминала"
              />
              <Select.Content>
                {TERMINAL_TYPES.map((item) => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />

      <Controller
        name="envs"
        control={formApi.control}
        rules={{
          validate: validateEnvs,
        }}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <Text
              as="label"
              size="2"
              weight="medium"
              className={styles.fieldLabel}
            >
              Переменные окружения
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Например, KEY1=VALUE1,KEY2=VALUE2"
              onChange={onInputChange(field.onChange)}
            >
              <TextField.Slot>
                <VariableIcon aria-hidden="true" />
              </TextField.Slot>
            </TextField.Root>
            {fieldState.invalid && (
              <Text size="1" color="red" as="p" mt="1">
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />
    </section>
  );
}
