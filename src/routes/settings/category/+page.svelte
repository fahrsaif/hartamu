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
        name: null,
        description: null,
    });
    let formTitle = $derived(category.id ? "Edit" : "Create");
    let buttonTitle = $derived(category.id ? "Update" : "Create");

    async function getAll() {
        categories = await db.sql`
        SELECT category_id, name, description 
        FROM categories
        ORDER BY name ASC;
        `;
    }

    function create() {
        formTitle = "Create";

        category = {
            id: null,
            name: null,
            description: null,
        };
    }

    function edit(item) {
        formTitle = "Edit";

        category = {
            id: item.category_id,
            name: item.name,
            description: item.description,
        };
    }

    async function save() {
        if (category.id) {
            await db.sql`
            UPDATE categories
            SET 
                name = ${category.name},
                description = ${category.description}
            WHERE category_id = ${category.id};
            `;
        } else {
            await db.sql`
            INSERT INTO categories (name, description) 
            VALUES (${category.name}, ${category.description});
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

<header class="navbar navbar-expand-md d-print-none">
    <div class="container-xl">
        <a href="/settings" class="navbar-toggler" type="button">
            <ChevronLeft />
        </a>
        <div
            class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"
        >
            Categories
        </div>
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
                {item.name}
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
            <input
                type="text"
                placeholder="Name"
                class="form-control"
                bind:value={category.name}
            />
            <input
                type="text"
                placeholder="Description"
                class="form-control"
                bind:value={category.description}
            />
            <button
                class="btn btn-primary w-100 mt-3"
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
