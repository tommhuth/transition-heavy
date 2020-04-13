import React, { useEffect, useRef } from "react"
import cn from "classnames"
import { api } from "../store"

export default function IntroTitle({ children, top, bottom }) {
    let ref = useRef()

    useEffect(() => {
        api.subscribe(([maxScroll, scrollPosition]) => {
            //console.log(maxScroll, scrollPosition)
        }, state => [state.maxScroll, state.scrollPosition])
    }, [])

    return (
        <div
            ref={ref}
            className={cn("title", {
                "title--top": top,
                "title--bottom": bottom
            })}
        >
            <h1>{children}</h1>
        </div>
    )
}