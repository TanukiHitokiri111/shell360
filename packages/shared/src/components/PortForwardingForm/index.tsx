import { Select, Text, TextField } from "@radix-ui/themes";
import { PortForwardingType } from "bridge/data";
import { Controller, type UseFormReturn } from "react-hook-form";

import { useHosts } from "@/hooks/useHosts";
import { onInputChange } from "@/utils/form";
import styles from "./index.module.less";

export type PortForwardingFormFields = {
  name: string;
  portForwardingType: PortForwardingType;
  hostId: string;
  localAddress: string;
  localPort: number | "";
  remoteAddress?: string;
  remotePort?: number | "";
};

export type PortForwardingFormProps = {
  formApi: UseFormReturn<PortForwardingFormFields>;
};

const PORT_FORWARDING_TYPES = [
  {
    label: "Локальный туннель",
    value: PortForwardingType.Local,
  },
  {
    label: "Удалённый туннель",
    value: PortForwardingType.Remote,
  },
  {
    label: "Динамический туннель",
    value: PortForwardingType.Dynamic,
  },
];

export function PortForwardingForm({ formApi }: PortForwardingFormProps) {
  const portForwardingType = formApi.watch("portForwardingType");
  const { data: hosts } = useHosts();
  const hostOptions = hosts ?? [];

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
        name="portForwardingType"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите тип туннеля",
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
              Тип туннеля
            </Text>
            <Select.Root
              value={field.value || PortForwardingType.Local}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content>
                {PORT_FORWARDING_TYPES.map((item) => (
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

      <Controller
        name="hostId"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Выберите хост",
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
              Хост
            </Text>
            <Select.Root
              value={field.value || ""}
              onValueChange={(value) => field.onChange(value)}
            >
              <Select.Trigger
                style={{ width: "100%" }}
                placeholder="Выберите хост"
              />
              <Select.Content>
                {hostOptions.map((item) => (
                  <Select.Item key={item.id} value={item.id}>
                    {item.name || `${item.hostname}:${item.port}`}
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

      <Controller
        name="localAddress"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите локальный адрес",
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
              Локальный адрес
            </Text>
            <TextField.Root
              value={field.value || ""}
              placeholder="Локальный адрес"
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
        name="localPort"
        control={formApi.control}
        rules={{
          required: {
            value: true,
            message: "Введите локальный порт",
          },
          pattern: {
            value: /^\d+$/,
            message: "Введите число",
          },
          min: {
            value: 1,
            message: "Локальный порт не может быть меньше 1",
          },
          max: {
            value: 65535,
            message: "Локальный порт не может быть больше 65535",
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
              Локальный порт
            </Text>
            <TextField.Root
              value={field.value === undefined ? "" : field.value}
              placeholder="Локальный порт"
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

      {portForwardingType !== PortForwardingType.Dynamic && (
        <>
          <Controller
            name="remoteAddress"
            control={formApi.control}
            rules={{
              required: {
                value: true,
                message: "Введите удалённый адрес",
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
                  Удалённый адрес
                </Text>
                <TextField.Root
                  value={field.value || ""}
                  placeholder="Удалённый адрес"
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
            name="remotePort"
            control={formApi.control}
            rules={{
              required: {
                value: true,
                message: "Введите удалённый порт",
              },
              pattern: {
                value: /^\d+$/,
                message: "Введите число",
              },
              min: {
                value: 1,
                message: "Удалённый порт не может быть меньше 1",
              },
              max: {
                value: 65535,
                message: "Удалённый порт не может быть больше 65535",
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
                  Удалённый порт
                </Text>
                <TextField.Root
                  value={field.value === undefined ? "" : field.value}
                  placeholder="Удалённый порт"
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
        </>
      )}
    </form>
  );
}
