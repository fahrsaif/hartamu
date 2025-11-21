export function now() {
    return new Date().toISOString().split("T")[0]
}

export function format(dateString) {
    const formatter = new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });

    return formatter.format(new Date(dateString))
}