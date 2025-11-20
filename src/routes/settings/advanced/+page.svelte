<script>
    import { db, migrate } from "$lib/db";
    import { ChevronLeft } from "@lucide/svelte";

    let fileInput = $state(null);

    async function download() {
        const databaseFile = await db.getDatabaseFile();
        const fileUrl = URL.createObjectURL(databaseFile);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = "database.sqlite3";
        a.click();
        a.remove();

        URL.revokeObjectURL(fileUrl);
    }

    async function upload() {
        let databaseFile = fileInput.files[0];
        await db.overwriteDatabaseFile(databaseFile);
    }

    async function reset() {
        await db.deleteDatabaseFile(async () => {
            await migrate();
        });
    }
</script>

<header class="navbar sticky-top">
    <div class="container-xl">
        <a href="/settings" class="navbar-toggler" type="button">
            <ChevronLeft />
        </a>
        <div class="navbar-brand navbar-brand-autodark">Advanced</div>
    </div>
</header>
<div class="card">
    <div class="card-body d-flex gap-3 justify-content-evenly">
        <button class="btn btn-primary w-full" onclick={download}>
            Export DB
        </button>
        <button
            class="btn btn-danger w-full"
            data-bs-toggle="offcanvas"
            href="#database_form"
        >
            Import DB
        </button>
        <button class="btn btn-light w-full" onclick={reset}> Reset DB </button>
    </div>
</div>
<div
    class="offcanvas offcanvas-bottom h-auto"
    tabindex="-1"
    id="database_form"
    aria-labelledby="database_form_label"
>
    <div class="offcanvas-header p-3">
        <h2 class="offcanvas-title" id="database_form_label">
            Import Database
        </h2>
    </div>
    <div class="offcanvas-body">
        <form class="space-y" onsubmit={upload}>
            <div>
                <div class="form-label">File</div>
                <input bind:this={fileInput} type="file" class="form-control" />
            </div>
            <button
                class="btn btn-danger w-100 my-3"
                data-bs-dismiss="offcanvas"
            >
                Import
            </button>
        </form>
    </div>
</div>
