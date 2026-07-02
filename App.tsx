import { StatusBar } from "expo-status-bar";
import TodoScreen from "./src/screens/TodoScreen";

export default function App() {
  return (
    <>
      <TodoScreen />
      <StatusBar style="auto" />
    </>
  );
}
