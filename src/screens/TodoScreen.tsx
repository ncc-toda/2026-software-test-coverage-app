import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TodoItem } from "../logic/TodoItem";
import { TodoStore } from "../logic/TodoStore";
import { Filter } from "../logic/Filter";
import { Stats } from "../logic/Stats";
import type { FilterKind } from "../logic/types";

// モジュールレベルのシングルトン（ロジックは logic 層に委譲）
const store = new TodoStore();
const filter = new Filter();
const stats = new Stats();

export default function TodoScreen() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [text, setText] = useState("");
  const [filterKind, setFilterKind] = useState<FilterKind>("all");

  /** store の最新状態を取得して表示リストを更新する */
  const refresh = () => setItems(store.all());

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item = new TodoItem({
      id: Date.now().toString(),
      title: trimmed,
      createdAt: new Date(),
    });
    store.add(item);
    setText("");
    refresh();
  };

  const handleToggle = (id: string) => {
    store.toggle(id);
    refresh();
  };

  const displayed = filter.apply(items, filterKind);
  const remaining = stats.remaining(items);
  const rate = stats.completionRate(items);

  const filterLabels: Record<FilterKind, string> = {
    all: "全て",
    active: "未完",
    completed: "完了",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>カバレッジ道場 TODO</Text>

      {/* 入力行 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="タスクを入力..."
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Button title="追加" onPress={handleAdd} />
      </View>

      {/* フィルタボタン */}
      <View style={styles.filterRow}>
        {(["all", "active", "completed"] as FilterKind[]).map((k) => (
          <TouchableOpacity
            key={k}
            onPress={() => setFilterKind(k)}
            style={[styles.filterBtn, filterKind === k && styles.filterBtnActive]}
          >
            <Text style={filterKind === k ? styles.filterTextActive : styles.filterText}>
              {filterLabels[k]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TODOリスト */}
      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleToggle(item.id)} style={styles.itemRow}>
            <Text style={item.done ? styles.itemDone : styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 統計行 */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>残り {remaining} 件</Text>
        <Text style={styles.statsText}>完了率 {Math.round(rate * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterText: {
    color: "#555",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#fff",
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  itemDone: {
    fontSize: 16,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  statsText: {
    fontSize: 14,
    color: "#555",
  },
});
