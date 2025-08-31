import { render } from "solid-js/web";
import { WerewolfGame } from "./WerewolfGame";

const root = document.getElementById("root") as HTMLElement;

render(
  () => (
      <WerewolfGame />
  ),
  root
);
