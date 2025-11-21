<script>
    import { format, now } from "$lib/date";
    import { db } from "$lib/db";
    import { AlertTriangle, Edit, Plus, Trash } from "@lucide/svelte";
    import { onMount } from "svelte";

    let wallets = $state([]);
    let categories = $state([]);
    let expenses = $state([]);
    let expense = $state({
        id: null,
        wallet_id: null,
        category_id: null,
        date: null,
        amount: null,
        description: null,
    });
    let formTitle = $derived(expense.id ? "Edit" : "Create");
    let buttonTitle = $derived(expense.id ? "Update" : "Create");
    let amountSign = $derived.by(() => {
        let type = categories.find(
            (item) => item.category_id == expense.category_id,
        )?.type;

        if (type == "Expense") {
            return "-";
        }

        return "";
    });
    $inspect(amountSign);

    async function getWallets() {
        wallets = await db.sql`
        SELECT wallet_id, name
        FROM wallets
        ORDER BY name ASC;
        `;
    }

    async function getCategories() {
        categories = await db.sql`
        SELECT category_id, type, name
        FROM categories
        ORDER BY name ASC;
        `;
    }

    async function getAll() {
        expenses = await db.sql`
        SELECT a.expense_id, a.wallet_id, a.category_id, a.date, a.amount, a.description, b.type category_type
        FROM expenses a
        JOIN categories b
        ON a.category_id = b.category_id
        ORDER BY a.date ASC;
        `;
    }

    function create() {
        formTitle = "Create";

        expense = {
            id: null,
            wallet_id: null,
            category_id: null,
            date: now(),
            amount: null,
            description: null,
        };
    }

    function edit(item) {
        formTitle = "Edit";

        expense = {
            id: item.expense_id,
            wallet_id: item.wallet_id,
            category_id: item.category_id,
            date: item.date,
            amount: item.amount < 0 ? item.amount * -1 : item.amount, // neutralize sign on edit
            description: item.description,
        };
    }

    async function save() {
        expense.amount = amountSign + expense.amount; // correct sign when save

        if (expense.id) {
            await db.sql`
            UPDATE expenses
            SET 
                wallet_id = ${expense.wallet_id},
                category_id = ${expense.category_id},
                date = ${expense.date},
                amount = ${expense.amount},
                description = ${expense.description}
            WHERE expense_id = ${expense.id};
            `;
        } else {
            await db.sql`
            INSERT INTO expenses (wallet_id, category_id, date, amount, description) 
            VALUES (${expense.wallet_id}, ${expense.category_id}, ${expense.date}, ${expense.amount}, ${expense.description});
            `;
        }

        await updateWalletBalance(expense.wallet_id);
        await getAll();
    }

    async function remove() {
        await db.sql`
        DELETE FROM expenses
        WHERE expense_id = ${expense.id};
        `;

        await updateWalletBalance(expense.wallet_id);
        await getAll();
    }

    async function updateWalletBalance(wallet_id) {
        let result = await db.sql`
        SELECT 
            SUM(amount) AS total_balance
        FROM 
            expenses
        WHERE 
            wallet_id = ${wallet_id};
        `;
        let transactionSum = result[0].total_balance;

        await db.sql`
        UPDATE wallets
        SET
            current_balance = ${transactionSum}
        WHERE
            wallet_id = ${wallet_id}
        `;
    }

    onMount(async () => {
        await getWallets();
        await getCategories();
        await getAll();
    });
</script>

<header class="navbar sticky-top">
    <div class="container-xl">
        <div class="navbar-brand navbar-brand-autodark">Transactions</div>
        <a
            type="button"
            class="btn btn-action text-primary"
            data-bs-toggle="offcanvas"
            href="#transaction_form"
            onclick={create}
        >
            <Plus />
        </a>
    </div>
</header>
<div class="card">
    <div
        class="list-group list-group-flush overflow-auto"
        style="max-height: 84vh;"
    >
        {#each expenses as item, i}
            {#if i == 0 || (i > 0 && item.date != expenses[i - 1].date)}
                <div class="list-group-header sticky-top">
                    {format(item.date)}
                </div>
            {/if}
            <div
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
                <div>
                    {#if item.category_type == "Expense"}
                        <div class="text-danger fw-bold">{item.amount}</div>
                    {:else if item.category_type == "Income"}
                        <div class="text-success fw-bold">+{item.amount}</div>
                    {/if}
                    <div class="fs-5 text-secondary">{item.description}</div>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-sm btn-action text-warning p-0"
                        data-bs-toggle="offcanvas"
                        href="#transaction_form"
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
    id="transaction_form"
    aria-labelledby="transaction_form_label"
>
    <div class="offcanvas-header p-3">
        <h2 class="offcanvas-title" id="transaction_form_label">
            {formTitle} Transaction
        </h2>
    </div>
    <div class="offcanvas-body">
        <form class="space-y" onsubmit={save}>
            <div>
                <div class="form-label">Wallet</div>
                <select class="form-select" bind:value={expense.wallet_id}>
                    {#each wallets as item}
                        <option value={item.wallet_id}>{item.name}</option>
                    {/each}
                </select>
            </div>
            <div>
                <div class="form-label">Category</div>
                <select class="form-select" bind:value={expense.category_id}>
                    {#each categories as item}
                        <option value={item.category_id}>{item.name}</option>
                    {/each}
                </select>
            </div>
            <div>
                <div class="form-label">Date</div>
                <input
                    type="date"
                    class="form-select"
                    bind:value={expense.date}
                />
            </div>
            <div>
                <div class="form-label">Amount</div>
                <input
                    type="number"
                    inputmode="numeric"
                    class="form-control"
                    bind:value={expense.amount}
                />
            </div>
            <div>
                <div class="form-label">Description</div>
                <input
                    type="text"
                    class="form-control"
                    bind:value={expense.description}
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
        <h3 class="mt-2">Delete Transaction ?</h3>
        <div class="my-3">
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
