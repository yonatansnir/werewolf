import { player } from "../signals";
import { Eye } from "../icons";
import { roleDefinitions } from "../../shared/role-definitions";
import { createSignal, Match, Show, Switch } from "solid-js";
import { WerewolfList } from "./WerewolfList";
import { Seer } from "./Seer";
import { Robber } from "./Robber";
import { Troublemaker } from "./Troublemaker";

export function Role() {
  const [showRole, setShowRole] = createSignal(false);
  const role = roleDefinitions[player()!.role];

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Your Secret Role</h1>
          <p class="text-gray-300">Keep this private!</p>
        </div>

        <Show when={!showRole()}>
          <div>
            <div class="w-20 h-20 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye class="w-10 h-10 text-purple-400" />
            </div>
            <h2 class="text-2xl font-semibold text-white mb-4">
              Ready to see your role?
            </h2>
            <p class="text-gray-400 mb-6">
              Make sure nobody else can see your screen!
            </p>
            <button
              onClick={() => setShowRole(true)}
              class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              Reveal My Role
            </button>
          </div>
        </Show>

        <Show when={showRole()}>
          <div class="bg-white/5 backdrop-blur-lg rounded-3xl p-6 text-center">
            <div>
              <div class={`rounded-2xl p-6 mb-6`}>
                <div class=" text-6xl text-white mx-auto mb-3">{role.icon}</div>
                {/* <h3 class="text-2xl font-bold text-white mb-3">{role.name}</h3> */}
                <h3 class={`text-2xl font-bold ${role.color} mb-3`}>
                  {role.name}
                </h3>
                <p class="text-white/90 text-sm leading-relaxed">
                  {role.description}
                </p>
                <Switch>
                  <Match when={player()!.role === "seer"} children={<Seer />} />
                  <Match
                    when={player()!.role === "werewolf"}
                    children={<WerewolfList />}
                  />
                  <Match
                    when={player()!.role === "robber"}
                    children={<Robber />}
                  />
                  <Match
                    when={player()!.role === "troublemaker"}
                    children={<Troublemaker />}
                  />
                </Switch>
              </div>

              <button class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors">
                I'm Ready to Play!
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
