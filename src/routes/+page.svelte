<script>
    import { db } from "$lib/db";
    import { onMount } from "svelte";

    let todos = $state(null);

    let todo = $state({
        id: null,
        title: null,
    });

    async function exportOPFSAsZip() {
        if (!navigator.storage?.getDirectory) {
            alert("OPFS not supported in this browser.");
            return;
        }

        const root = await navigator.storage.getDirectory();
        const zip = new JSZip();

        async function addToZip(dirHandle, zipFolder) {
            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === "file") {
                    const file = await handle.getFile();
                    const data = await file.arrayBuffer();
                    zipFolder.file(name, data);
                } else if (handle.kind === "directory") {
                    const newZipFolder = zipFolder.folder(name);
                    const subdir = await dirHandle.getDirectoryHandle(name);
                    await addToZip(subdir, newZipFolder);
                }
            }
        }

        await addToZip(root, zip);

        const blob = await zip.generateAsync({ type: "blob" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "opfs_backup.zip";
        a.click();

        URL.revokeObjectURL(url);
    }

    onMount(async () => {
        await getAll();
    });

    async function getAll() {
        todos = await db.sql`SELECT * FROM todos`;
    }

    async function save() {
        if (todo.id) {
            await db.sql`
            UPDATE todos
                SET title = ${todo.title}
                WHERE id = ${todo.id};`;
        } else {
            await db.sql`INSERT INTO todos (title) VALUES (${todo.title});`;
        }

        todo = {
            id: null,
            title: null,
        };

        await getAll();
    }

    function edit(item) {
        todo.id = item.id;
        todo.title = item.title;
    }

    async function remove(item) {
        await db.sql`DELETE FROM todos WHERE id = ${item.id};`;

        await getAll();
    }

    $inspect(todos);
</script>

<form onsubmit={save}>
    <input type="text" bind:value={todo.title} />
    <button>submit</button>
    <button type="button" onclick={exportOPFSAsZip}>export</button>
</form>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each todos as item}
            <tr>
                <th>{item.id}</th>
                <th>{item.title}</th>
                <th>{item.is_completed}</th>
                <th>
                    <button onclick={() => edit(item)}>edit</button>
                    <button onclick={() => remove(item)}>delete</button>
                </th>
            </tr>
        {/each}
    </tbody>
</table>
