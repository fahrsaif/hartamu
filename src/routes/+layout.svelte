<script>
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import { ArrowRightLeft, ChartPie, Settings } from "@lucide/svelte";
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
	<div class="page-wrapper">
		{@render children()}
		<footer class="footer pt-3 sticky-bottom">
			<ul
				class="d-flex flex-col justify-content-around mb-0 list-unstyled"
			>
				<li
					class={[
						"nav-item",
						page.url.pathname == "/summary" && "text-primary",
					]}
				>
					<a class="nav-link flex-column" href="/summary">
						<span class="nav-link-icon">
							<ChartPie />
						</span>
						<span class="nav-link-title">Summary</span>
					</a>
				</li>
				<li
					class={[
						"nav-item",
						page.url.pathname == "/" && "text-primary",
					]}
				>
					<a class="nav-link flex-column" href="/">
						<span class="nav-link-icon">
							<ArrowRightLeft />
						</span>
						<span class="nav-link-title">Transaction</span>
					</a>
				</li>
				<li
					class={[
						"nav-item",
						page.url.pathname.includes("/settings") &&
							"text-primary",
					]}
				>
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
