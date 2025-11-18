<script>
	import favicon from "$lib/assets/favicon.svg";
	import "@fontsource/inter";
	import { ChartPie, List, Settings } from "@lucide/svelte";
	import "@tabler/core/dist/css/tabler.min.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
	<div class="page-wrapper">
		{@render children()}
		<footer class="footer">
			<ul class="d-flex flex-col justify-content-around list-unstyled">
				<li class="nav-item active">
					<a class="nav-link flex-column" href="/summary">
						<span class="nav-link-icon">
							<ChartPie />
						</span>
						<span class="nav-link-title">Summary</span>
					</a>
				</li>
				<li class="nav-item active">
					<a class="nav-link flex-column" href="/">
						<span class="nav-link-icon">
							<List />
						</span>
						<span class="nav-link-title">List</span>
					</a>
				</li>
				<li class="nav-item active">
					<a class="nav-link flex-column" href="/settings">
						<span class="nav-link-icon">
							<Settings />
						</span>
						<span class="nav-link-title">Settings</span>
					</a>
				</li>
			</ul>
		</footer>
	</div>
</div>
