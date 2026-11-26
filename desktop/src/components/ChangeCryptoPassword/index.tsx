import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import { changeCryptoPassword } from "bridge/data";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loading } from "shared";

import CryptoPasswordField from "@/components/CryptoPasswordField";
import useMessage from "@/hooks/useMessage";

interface ChangeCryptoPasswordProps {
  open: boolean;
  onCancel: () => unknown;
  onOk: () => unknown;
}

export default function ChangeCryptoPassword({
  open,
  onCancel,
  onOk,
}: ChangeCryptoPasswordProps) {
  const message = useMessage();
  const formApi = useForm({
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { run: onSubmit, loading } = useRequest(
    async () => {
      const { oldPassword, password, confirmPassword } = formApi.getValues();
      await changeCryptoPassword({ oldPassword, password, confirmPassword });
    },
    {
      manual: true,
      onSuccess: () => {
        message.success({
          message: "Пароль шифрования изменён",
        });
        onOk();
      },
      onError: () => {
        message.error({
          message: "Не удалось изменить пароль шифрования",
        });
      },
    },
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    formApi.reset();
  }, [open, formApi]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: 420 }}>
        <Dialog.Title>Изменение пароля шифрования</Dialog.Title>
        <Loading loading={loading} size={32}>
          <Dialog.Description size="2" color="gray">
            Введите текущий пароль и выберите новый для повторного шифрования данных приложения.
          </Dialog.Description>
          <form noValidate autoComplete="off">
            <Flex direction="column" gap="4" mt="4">
              <CryptoPasswordField
                control={formApi.control}
                name="oldPassword"
                label="Старый пароль"
                placeholder="Старый пароль"
                requiredMessage="Введите старый пароль"
              />
              <CryptoPasswordField
                control={formApi.control}
                name="password"
                label="Пароль"
                placeholder="Пароль"
                requiredMessage="Введите пароль"
              />
              <CryptoPasswordField
                control={formApi.control}
                name="confirmPassword"
                label="Подтверждение пароля"
                placeholder="Подтвердите пароль"
                requiredMessage="Подтвердите пароль"
                matchField="password"
              />
            </Flex>
          </form>
          <Flex gap="3" justify="end" mt="4">
            <Button variant="outline" disabled={loading} onClick={onCancel}>
              Отмена
            </Button>
            <Button loading={loading} onClick={formApi.handleSubmit(onSubmit)}>
              Подтвердить
            </Button>
          </Flex>
        </Loading>
      </Dialog.Content>
    </Dialog.Root>
  );
}
