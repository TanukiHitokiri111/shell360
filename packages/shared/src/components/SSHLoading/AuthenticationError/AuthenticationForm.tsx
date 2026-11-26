import { Select, Text } from "@radix-ui/themes";
import { AuthenticationMethod } from "bridge/data";
import type { ChangeEvent } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { useKeys } from "@/hooks/useKeys";
import { TextFieldPassword } from "../../TextFieldPassword";
import styles from "../styles.module.less";

export type AuthenticationFormFields = {
  username?: string;
  authenticationMethod?: AuthenticationMethod;
  password?: string;
  keyId?: string;
};

export type AuthenticationFormProps = {
  formApi: UseFormReturn<AuthenticationFormFields>;
  onOpenAddKey: () => void;
};

const ADD_KEY_VALUE = "__add_key__";

export function AuthenticationForm({
  formApi,
  onOpenAddKey,
}: AuthenticationFormProps) {
  const { data: keys } = useKeys();
  const keyOptions = keys ?? [];
  const authenticationMethod = formApi.watch("authenticationMethod");

  return (
    <>
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
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger style={{ width: "100%" }} />
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
                  SSH-агент
                </Select.Item>
                <Select.Item value={AuthenticationMethod.KeyboardInteractive}>
                  Интерактивная аутентификация
                </Select.Item>
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
              <Text
                as="label"
                size="2"
                weight="medium"
                className={styles.fieldLabel}
              >
                Пароль
              </Text>
              <TextFieldPassword
                value={field.value || ""}
                error={fieldState.invalid}
                placeholder="Пароль"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  field.onChange(e.target.value)
                }
              />
              {fieldState.invalid && (
                <Text size="1" className={styles.errorHint}>
                  {fieldState.error?.message}
                </Text>
              )}
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
                <Select.Trigger
                  style={{ width: "100%" }}
                  placeholder="Выберите ключ"
                />
                <Select.Content>
                  <Select.Item value={ADD_KEY_VALUE}>
                    + Добавить ключ
                  </Select.Item>
                  {keyOptions.map((item) => (
                    <Select.Item key={item.id} value={item.id}>
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
      )}
    </>
  );
}
