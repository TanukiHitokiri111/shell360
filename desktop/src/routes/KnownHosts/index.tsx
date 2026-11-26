import { Badge, Button, Flex } from "@radix-ui/themes";
import { BaseDirectory, readTextFile, writeTextFile } from "bridge/fs";
import { type MouseEvent, useCallback, useMemo, useState } from "react";
import { getTagTone, type KnownHost, useKnownHostsStore } from "shared";
import Empty from "@/components/Empty";
import ListToolbar from "@/components/ListToolbar";
import PanelTable from "@/components/PanelTable";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { filterByKeyword } from "@/utils/list";
import styles from "./index.module.less";

const KNOWN_HOSTS_PATH = "./known_hosts";
const KNOWN_HOSTS_BASE_DIR = BaseDirectory.AppLocalData;

function getKnownHostLabel(host: string) {
  return host.split(/[,:]/)[0] || host;
}

function getFingerprint(key: string) {
  if (key.length <= 18) {
    return key;
  }

  return `${key.slice(0, 12)}...${key.slice(-4)}`;
}

function getTagColor(tag: string) {
  switch (getTagTone(tag)) {
    case "Prod":
      return "red" as const;
    case "Staging":
      return "amber" as const;
    case "Local":
      return "green" as const;
    default:
      return "indigo" as const;
  }
}

export default function KnownHosts() {
  const [keyword, setKeyword] = useState("");
  const confirmDelete = useConfirmDelete();
  const { items, remove } = useKnownHostsStore({
    readText: useCallback(async () => {
      try {
        return await readTextFile(KNOWN_HOSTS_PATH, {
          baseDir: KNOWN_HOSTS_BASE_DIR,
        });
      } catch {
        return "";
      }
    }, []),
    writeText: useCallback(async (data: string) => {
      await writeTextFile(KNOWN_HOSTS_PATH, data, {
        baseDir: KNOWN_HOSTS_BASE_DIR,
      });
    }, []),
  });

  const onDelete = useCallback(
    (event: MouseEvent<HTMLButtonElement>, knownHost: KnownHost) => {
      event.stopPropagation();

      const knownHostContent = knownHost.rawLine;
      confirmDelete({
        content: (
          <div className={styles.confirmContent}>
            Удалить известный хост:
            {knownHostContent}?
          </div>
        ),
        failureMessage: "Не удалось удалить",
        onDelete: async () => {
          await remove(knownHost);
        },
      });
    },
    [confirmDelete, remove],
  );

  const filteredItems = useMemo(() => {
    return filterByKeyword(items, keyword, [
      (item) => item.host,
      (item) => item.type,
      (item) => item.key,
    ]);
  }, [items, keyword]);

  return (
    <div className={styles.page}>
      <ListToolbar
        title="Известные хосты"
        keyword={keyword}
        onKeywordChange={setKeyword}
        searchPlaceholder="Поиск хостов..."
      />
      <div className={styles.content}>
        {filteredItems.length ? (
          <PanelTable>
            <thead>
              <tr>
                <th>Имя хоста / IP</th>
                <th>Тип ключа</th>
                <th>Отпечаток</th>
                <th>Метка</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className={styles.hostCell}>{item.host}</td>
                  <td>
                    <Badge color="indigo" size="1">
                      {item.type}
                    </Badge>
                  </td>
                  <td className={styles.fingerprintCell}>
                    {getFingerprint(item.key)}
                  </td>
                  <td>
                    <Badge color={getTagColor(item.host)} size="1">
                      {getKnownHostLabel(item.host)}
                    </Badge>
                  </td>
                  <td>
                    <Flex gap="1">
                      <Button
                        type="button"
                        color="red"
                        size="1"
                        variant="ghost"
                        className={styles.actionButton}
                        onClick={(event) => onDelete(event, item)}
                      >
                        Удалить
                      </Button>
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        ) : (
          <Empty desc="Известных хостов пока нет." />
        )}
      </div>
    </div>
  );
}
