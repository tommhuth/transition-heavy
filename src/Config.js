export default {
    TRANSITION_DURATION: 1000,
    REGISTER_SERVICEWORKER: process.env.REGISTER_SERVICEWORKER === "true",
    URLS: [
        {
            url: "/",
            origin: "bottom"
        },
        {
            url: "/table-of-contents",
            origin: "bottom"
        },
        {
            url: "/article-1",
            origin: "bottom-partial"
        },
        {
            url: "/article-2",
            origin: "bottom-partial"
        }
    ]
}