<script>
    import { ChevronRight } from "@lucide/svelte";
</script>

<header class="navbar sticky-top">
    <div class="container-xl justify-content-center">
        <div class="navbar-brand navbar-brand-autodark">Settings</div>
    </div>
</header>
<div class="card">
    <div class="list-group list-group-flush">
        <a
            href="/settings/wallet"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Wallets
            <ChevronRight />
        </a>
        <a
            href="/settings/category"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Categories
            <ChevronRight />
        </a>
        <a
            href="/settings/advanced"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Advanced
            <ChevronRight />
        </a>
    </div>
</div>
