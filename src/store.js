import create from "zustand"

const [useStore, api] = create((set, get) => {
    return {
        navigating: false,
        maxScroll: 0,
        scrollPosition: 0,

        // actions
        setScrollPosition(position) {
            set({
                scrollPosition: position
            })
        },
        setMaxScroll(max) {
            set({
                maxScroll: max
            })
        },
        setNavigating(val) {
            set({
                navigating: val
            })
        }
    }
})

export {api, useStore}