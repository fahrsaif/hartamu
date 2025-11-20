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

    let categories = $state([]);
    let category = $state({
        id: null,
        type: null,
        name: null,
        description: null,
    });
    let formTitle = $derived(category.id ? "Edit" : "Create");
    let buttonTitle = $derived(category.id ? "Update" : "Create");

    async function getAll() {
        categories = await db.sql`
        SELECT category_id, type, name, description 
        FROM categories
        ORDER BY name ASC;
        `;
    }

    function create() {
        formTitle = "Create";

        category = {
            id: null,
            type: "Expense",
            name: null,
            description: null,
        };
    }

    function edit(item) {
        formTitle = "Edit";

        category = {
            id: item.category_id,
            type: item.type,
            name: item.name,
            description: item.description,
        };
    }

    async function save() {
        if (category.id) {
            await db.sql`
            UPDATE categories
            SET 
                type = ${category.type},
                name = ${category.name},
                description = ${category.description}
            WHERE category_id = ${category.id};
            `;
        } else {
            await db.sql`
            INSERT INTO categories (type, name, description) 
            VALUES (${category.type}, ${category.name}, ${category.description});
            `;
        }

        await getAll();
    }

    async function remove() {
        await db.sql`
        DELETE FROM categories
        WHERE category_id = ${category.id};
        `;

        await getAll();
    }

    onMount(async () => {
        await getAll();
    });
</script>

<header class="navbar sticky-top">
    <div class="container-xl">
        <a href="/settings" class="navbar-toggler" type="button">
            <ChevronLeft />
        </a>
        <div class="navbar-brand navbar-brand-autodark">Categories</div>
        <a
            type="button"
            class="btn btn-action text-primary"
            data-bs-toggle="offcanvas"
            href="#category_form"
            onclick={create}
        >
            <Plus />
        </a>
    </div>
</header>
<div class="card">
    <div class="list-group list-group-flush">
        {#each categories as item}
            <div
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
                <div>
                    <div>{item.name}</div>
                    <div class="fs-5 text-secondary">{item.type}</div>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-sm btn-action text-warning p-0"
                        data-bs-toggle="offcanvas"
                        href="#category_form"
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
    id="category_form"
    aria-labelledby="category_form_label"
>
    <div class="offcanvas-header p-3">
        <h2 class="offcanvas-title" id="category_form_label">
            {formTitle} Category
        </h2>
    </div>
    <div class="offcanvas-body">
        <form class="space-y" onsubmit={save}>
            <div>
                <div class="form-label">Type</div>
                <select class="form-select" bind:value={category.type}>
                    <option>Expense</option>
                    <option>Income</option>
                </select>
            </div>
            <div>
                <div class="form-label">Name</div>
                <input
                    type="text"
                    class="form-control"
                    bind:value={category.name}
                />
            </div>
            <div>
                <div class="form-label">Description</div>
                <input
                    type="text"
                    class="form-control"
                    bind:value={category.description}
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
        <h3 class="mt-2">Delete {category.name} ?</h3>
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
