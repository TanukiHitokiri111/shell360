import { IconButton, Text, TextArea, TextField } from "@radix-ui/themes";
import type { Key } from "bridge/data";
import { useCallback } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { onInputChange, onTextareaChange } from "@/utils/form";
import { FileUploadIcon } from "../Icon";
import { TextFieldPassword } from "../TextFieldPassword";
import styles from "./index.module.less";

export type EditKeyFormFields = Partial<Omit<Key, "id">>;

export type EditKeyFormProps = {
  formApi: UseFormReturn<EditKeyFormFields>;
  onImportTextFile?: () => Promise<
    | {
        filename: string;
        content: string;
      }
    | undefined
  >;
};

export function EditKeyForm({ formApi, onImportTextFile }: EditKeyFormProps) {
  const importPrivateKey = useCallback(async () => {
    const file = await onImportTextFile?.();
    if (!file) {
      return;
    }
    if (!formApi.getValues("name")) {
      formApi.setValue("name", file.filename);
    }
    formApi.setValue("privateKey", file.content);
  }, [formApi, onImportTextFile]);

  const importPublicKey = useCallback(async () => {
    const file = await onImportTextFile?.();
    if (!file) {
      return;
    }
    formApi.setValue("publicKey", file.content);
  }, [formApi, onImportTextFile]);

  const importCertificate = useCallback(async () => {
    const file = await onImportTextFile?.();
    if (!file) {
      return;
    }
    formApi.setValue("certificate", file.content);
  }, [formApi, onImportTextFile]);

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
        name="privateKey"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите закрытый ключ",
          },
        }}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <div className={styles.fieldHeader}>
              <Text
                as="label"
                size="2"
                weight="medium"
                className={styles.fieldLabel}
              >
                Закрытый ключ
              </Text>
              <IconButton
                type="button"
                variant="outline"
                color="gray"
                disabled={!onImportTextFile}
                onClick={importPrivateKey}
              >
                <FileUploadIcon />
              </IconButton>
            </div>
            <TextArea
              value={field.value || ""}
              placeholder="Закрытый ключ"
              rows={6}
              onChange={onTextareaChange(field.onChange)}
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
        name="publicKey"
        control={formApi.control}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <div className={styles.fieldHeader}>
              <Text
                as="label"
                size="2"
                weight="medium"
                className={styles.fieldLabel}
              >
                Открытый ключ
              </Text>
              <IconButton
                type="button"
                variant="outline"
                color="gray"
                disabled={!onImportTextFile}
                onClick={importPublicKey}
              >
                <FileUploadIcon />
              </IconButton>
            </div>
            <TextArea
              value={field.value || ""}
              placeholder="Открытый ключ"
              rows={6}
              onChange={onTextareaChange(field.onChange)}
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
      <Controller
        name="certificate"
        control={formApi.control}
        render={({ field, fieldState }) => (
          <div className={styles.formField}>
            <div className={styles.fieldHeader}>
              <Text
                as="label"
                size="2"
                weight="medium"
                className={styles.fieldLabel}
              >
                Сертификат
              </Text>
              <IconButton
                type="button"
                variant="outline"
                color="gray"
                disabled={!onImportTextFile}
                onClick={importCertificate}
              >
                <FileUploadIcon />
              </IconButton>
            </div>
            <TextArea
              value={field.value || ""}
              placeholder="Сертификат"
              rows={6}
              onChange={onTextareaChange(field.onChange)}
            />
            {fieldState.invalid && (
              <Text size="1" className={styles.errorHint}>
                {fieldState.error?.message}
              </Text>
            )}
          </div>
        )}
      />
    </form>
  );
}
