import { Select, Text, TextField } from "@radix-ui/themes";
import { useCallback } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { onInputChange } from "@/utils/form";
import { TextFieldPassword } from "../TextFieldPassword";
import styles from "./index.module.less";

enum Algorithm {
  Ed25519 = "Ed25519",
  Rsa = "Rsa",
  Ecdsa = "Ecdsa",
}

const ALGORITHM_MENUS = [
  { label: "ed25519", value: Algorithm.Ed25519 },
  { label: "rsa", value: Algorithm.Rsa },
  { label: "ecdsa", value: Algorithm.Ecdsa },
];

const RSA_BIT_SIZE = [
  { label: "2048", value: 2048 },
  { label: "4096", value: 4096 },
];

const ECDSA_CURVE = [
  { label: "NIST P-256", value: "NistP256" },
  { label: "NIST P-384", value: "NistP384" },
  { label: "NIST P-521", value: "NistP521" },
];

export type GenerateKeyFormFields = {
  name: string;
  algorithm: Algorithm | "";
  bitSize?: 2048 | 4096 | "";
  curve?: "NistP256" | "NistP384" | "NistP521" | "";
  passphrase?: string;
};

export type GenerateKeyFormProps = {
  formApi: UseFormReturn<GenerateKeyFormFields>;
};

export function GenerateKeyForm({ formApi }: GenerateKeyFormProps) {
  const algorithm = formApi.watch("algorithm");

  const onAlgorithmChange = useCallback(
    (value: string) => {
      formApi.setValue("algorithm", value as Algorithm);
      if (value !== Algorithm.Rsa) {
        formApi.setValue("bitSize", "");
      }
      if (value !== Algorithm.Ecdsa) {
        formApi.setValue("curve", "");
      }
    },
    [formApi],
  );

  return (
    <form className={styles.form} noValidate autoComplete="off">
      <Controller
        name="name"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите название",
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
        defaultValue=""
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
              <Text size="1" className={styles.errorHint}>
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />
      <Controller
        name="algorithm"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите алгоритм",
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
              Алгоритм
            </Text>
            <Select.Root
              value={field.value || ""}
              onValueChange={onAlgorithmChange}
            >
              <Select.Trigger
                style={{ width: "100%" }}
                placeholder="Выберите алгоритм"
              />
              <Select.Content>
                {ALGORITHM_MENUS.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
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
      {algorithm === Algorithm.Rsa && (
        <Controller
          name="bitSize"
          control={formApi.control}
          rules={{
            required: {
              value: true,
              message: "Выберите длину ключа",
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
                Длина ключа
              </Text>
              <Select.Root
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <Select.Trigger
                  style={{ width: "100%" }}
                  placeholder="Выберите длину ключа"
                />
                <Select.Content>
                  {RSA_BIT_SIZE.map((item) => (
                    <Select.Item key={item.value} value={String(item.value)}>
                      {item.label}
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
      {algorithm === Algorithm.Ecdsa && (
        <Controller
          name="curve"
          control={formApi.control}
          rules={{
            required: {
              value: true,
              message: "Выберите кривую",
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
                Кривая
              </Text>
              <Select.Root
                value={field.value || ""}
                onValueChange={(value) => field.onChange(value)}
              >
                <Select.Trigger
                  style={{ width: "100%" }}
                  placeholder="Выберите кривую"
                />
                <Select.Content>
                  {ECDSA_CURVE.map((item) => (
                    <Select.Item key={item.value} value={item.value}>
                      {item.label}
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
      <Controller
        name="passphrase"
        control={formApi.control}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <TextFieldPassword
              {...field}
              sx={undefined}
              className={styles.formFieldInput}
              fullWidth
              label="Кодовая фраза"
              placeholder="Кодовая фраза"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          </div>
        )}
      />
    </form>
  );
}
