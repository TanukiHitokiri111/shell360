import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useRequest } from "ahooks";
import { changeCryptoEnable } from "bridge/data";
import { useForm } from "react-hook-form";
import { Loading } from "shared";

import { useUpdateCryptoIsEnable } from "@/atoms/crypto.atom";
import CryptoPasswordField from "@/components/CryptoPasswordField";
import useMessage from "@/hooks/useMessage";

interface InitCryptoProps {
  open: boolean;
  onCancel: () => unknown;
  onOk: () => unknown;
}

export default function InitCrypto({ open, onCancel, onOk }: InitCryptoProps) {
  const message = useMessage();
  const updateCryptoIsEnable = useUpdateCryptoIsEnable();
  const formApi = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { run: onInitCryptoPassword, loading: initCryptoPasswordLoading } =
    useRequest(
      async () => {
        const { password, confirmPassword } = formApi.getValues();
        await changeCryptoEnable({
          cryptoEnable: true,
          password,
          confirmPassword,
        });
        await updateCryptoIsEnable();
      },
      {
        manual: true,
        onSuccess: () => {
          message.success({
            message: "Шифрование включено",
          });
          onOk();
        },
        onError: () => {
          message.error({
            message: "Не удалось включить шифрование",
          });
        },
      },
    );

  const loading = initCryptoPasswordLoading;

  return (
    <Dialog.Root open={open}>
      <Dialog.Content style={{ maxWidth: 420 }}>
        <Dialog.Title>Включение шифрования</Dialog.Title>
        <Loading loading={loading} size={32}>
          <Dialog.Description size="2" color="gray">
            Установите пароль для шифрования данных приложения. Сохраните его в надёжном месте: восстановить утраченный пароль невозможно.
          </Dialog.Description>
          <form noValidate autoComplete="off">
            <Flex direction="column" gap="4" mt="4">
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
            <Button
              loading={loading}
              onClick={formApi.handleSubmit(onInitCryptoPassword)}
            >
              Подтвердить
            </Button>
          </Flex>
        </Loading>
      </Dialog.Content>
    </Dialog.Root>
  );
}
