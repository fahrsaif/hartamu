<script>
    import { ChevronRight } from "@lucide/svelte";
</script>

<header class="navbar navbar-expand-md d-print-none">
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
            Wallet
            <ChevronRight />
        </a>
        <a
            href="/settings/category"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Category
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
