<script>
    import { ChevronRight } from "@lucide/svelte";
</script>

<div class="card">
    <div class="card-header">
        <h3 class="card-title fw-semibold">Settings</h3>
    </div>
    <div class="list-group list-group-flush">
        <a
            href="/settings/category"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Category
            <ChevronRight />
        </a>
        <a
            href="/settings/wallet"
            class="list-group-item list-group-item-action d-flex justify-content-between"
        >
            Wallet
            <ChevronRight />
        </a>
    </div>
</div>
