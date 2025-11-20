import { migrate } from "$lib/db";
import '@tabler/core/dist/js/tabler.min.js';

await migrate()