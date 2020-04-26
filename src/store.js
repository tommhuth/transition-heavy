import create from "zustand"

const [useStore, api] = create((set, get) => {
    return {
        transitioning: false, 
        setTransitioning(value) {
            set({
                transitioning: value
            })
        }
    }
})

export {api, useStore}