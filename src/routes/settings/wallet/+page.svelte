<script>
    import { db } from "$lib/db";
    import {
        AlertTriangle,
        ChevronLeft,
        Edit,
        Plus,
        Trash,
    } from "@lucide/svelte";
    import { onMount } from "svelte";

    let wallets = $state([]);
    let wallet = $state({
        id: null,
        name: null,
        type: null,
        initial_balance: null,
    });
    let formTitle = $derived(wallet.id ? "Edit" : "Create");
    let buttonTitle = $derived(wallet.id ? "Update" : "Create");

    async function getAll() {
        wallets = await db.sql`
        SELECT wallet_id, name, type, initial_balance
        FROM wallets
        ORDER BY name ASC;
        `;
    }

    function create() {
        formTitle = "Create";

        wallet = {
            id: null,
            name: null,
            type: null,
            initial_balance: null,
        };
    }

    function edit(item) {
        formTitle = "Edit";

        wallet = {
            id: item.wallet_id,
            name: item.name,
            type: item.type,
            initial_balance: item.initial_balance,
        };
    }

    async function save() {
        if (wallet.id) {
            await db.sql`
            UPDATE wallets
            SET 
                name = ${wallet.name},
                type = ${wallet.type},
                initial_balance = ${wallet.initial_balance}
            WHERE wallet_id = ${wallet.id};
            `;
        } else {
            await db.sql`
            INSERT INTO wallets (name, type, initial_balance) 
            VALUES (${wallet.name}, ${wallet.type}, ${wallet.initial_balance});
            `;
        }

        await getAll();
    }

    async function remove() {
        await db.sql`
        DELETE FROM wallets
        WHERE wallet_id = ${wallet.id};
        `;

        await getAll();
    }

    onMount(async () => {
        await getAll();
    });
</script>

<header class="navbar navbar-expand-md d-print-none">
    <div class="container-xl">
        <a href="/settings" class="navbar-toggler" type="button">
            <ChevronLeft />
        </a>
        <div
            class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"
        >
            Wallets
        </div>
        <a
            type="button"
            class="btn btn-action text-primary"
            data-bs-toggle="offcanvas"
            href="#wallet_form"
            onclick={create}
        >
            <Plus />
        </a>
    </div>
</header>
<div class="card">
    <div class="list-group list-group-flush">
        {#each wallets as item}
            <div
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
                {item.name}
                <div>
                    <button
                        type="button"
                        class="btn btn-sm btn-action text-warning p-0"
                        data-bs-toggle="offcanvas"
                        href="#wallet_form"
                        onclick={() => edit(item)}
                    >
                        <Edit />
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-action text-danger p-0"
                        data-bs-toggle="offcanvas"
                        href="#delete_confirmation"
                        onclick={() => edit(item)}
                    >
                        <Trash />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
<div
    class="offcanvas offcanvas-bottom h-auto"
    tabindex="-1"
    id="wallet_form"
    aria-labelledby="wallet_form_label"
>
    <div class="offcanvas-header p-3">
        <h2 class="offcanvas-title" id="wallet_form_label">
            {formTitle} Wallet
        </h2>
    </div>
    <div class="offcanvas-body">
        <form class="space-y" onsubmit={save}>
            <div>
                <div class="form-label">Name</div>
                <input
                    type="text"
                    class="form-control"
                    bind:value={wallet.name}
                />
            </div>
            <div>
                <div class="form-label">Type</div>
                <select
                    type="text"
                    class="form-select"
                    bind:value={wallet.type}
                >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                </select>
            </div>
            <div>
                <div class="form-label">Initial Balance</div>
                <input
                    type="text"
                    class="form-control"
                    bind:value={wallet.initial_balance}
                />
            </div>
            <button
                class="btn btn-primary w-100 my-3"
                data-bs-dismiss="offcanvas"
            >
                {buttonTitle}
            </button>
        </form>
    </div>
</div>
<div
    class="offcanvas offcanvas-bottom h-auto"
    tabindex="-1"
    id="delete_confirmation"
    aria-labelledby="delete_confirmation_label"
>
    <div class="offcanvas-body text-center">
        <AlertTriangle size="52" strokeWidth="1" class="text-danger" />
        <h3 class="mt-2">Delete {wallet.name} ?</h3>
        <div class="mt-3">
            <button
                class="btn btn-danger w-100"
                onclick={remove}
                data-bs-dismiss="offcanvas"
            >
                Delete
            </button>
        </div>
    </div>
</div>
