import create from "zustand"

const [useStore, api] = create((set, get) => {
    return {
        transitioning: false, 
        action: null,
        setTransitioning(value) {
            set({
                transitioning: value
            })
        }, 
        setAction(action) {
            set({
                action
            })
        }
    }
})

export {api, useStore}