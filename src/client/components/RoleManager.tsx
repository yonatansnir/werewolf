import { createSignal } from "solid-js";
import { roleDefinitions } from "../../shared/role-definitions";

type RoleKey = keyof typeof roleDefinitions;

export function RoleManager() {
	const [selectedRoles, setSelectedRoles] = createSignal<RoleKey[]>([]);

	const toggleRole = (role: RoleKey) => {
		setSelectedRoles((prev) =>
			prev.includes(role)
				? prev.filter((r) => r !== role)
				: [...prev, role]
		);
	};

	return (
		<div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
			<h3 class="text-lg font-semibold text-white mb-3">Select Roles</h3>
			<div class="grid grid-cols-2 gap-4">
				{Object.entries(roleDefinitions).map(([key, role]) => (
					<button
						onClick={() => toggleRole(key as RoleKey)}
						class={`p-4 rounded-xl border text-white transition-colors ${
							selectedRoles().includes(key as RoleKey)
								? `bg-blue-900`
								: "bg-white/20 border-white/30"
						}`}
					>
						<span class="text-2xl">{role.icon}</span>
						<p class="mt-2 text-sm font-medium">{role.name}</p>
					</button>
				))}
			</div>
		</div>
	);
}
