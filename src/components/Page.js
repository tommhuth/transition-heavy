import React from "react"
import { useLocation } from "@reach/router"
import { motion } from "framer-motion"
import Scroller from "./Scroller"
import IntroTitle from "./IntroTitle"
import Only from "./Only"
import Config from "../Config"

export default function Page({
    children,
    title
}) {
    let state = useLocation().state
    let origin = (state && state.origin) || "bottom"
    let animate = {}
    let exit = {}
    let initial = {}

    if (origin === "top") {
        exit.y = "100vh"
        exit.zIndex = 2
        exit.position = "absolute"
        exit.left = 0
        exit.right = 0

        animate.y = 0

        initial.y = -200
    }

    if (origin === "bottom") {
        exit.y = -300

        initial.zIndex = 2
        initial.position = "absolute"
        initial.left = 0
        initial.right = 0
        initial.height = "100vh"
        initial.top = 0
        initial.y = "100vh"

        animate.y = 0
    }

    if (origin === "bottom-partial") {
        exit.y = -300

        initial.zIndex = 2
        initial.position = "absolute"
        initial.left = 0
        initial.right = 0
        initial.height = "100vh"
        initial.top = 0
        initial.y = window.innerHeight - 374

        animate.y = 0
    }

    return (
        <motion.div
            className="page"
            animate={{
                ...animate,
                transition: {
                    duration: Config.TRANSITION_DURATION / 1000,
                    ease: [0.76, 0, 0.24, 1]
                },
                transitionEnd: {
                    zIndex: null,
                    height: null,
                    position: null,
                    left: null,
                    right: null,
                    top: null
                }
            }}
            exit={{
                ...exit,

                transition: {
                    duration: Config.TRANSITION_DURATION / 1000,
                    ease: [0.76, 0, 0.24, 1]
                }
            }}
            initial={{
                ...initial,

            }}
        >
            <Scroller>
                <div className="page__inner">
                    <Only if={title}>
                        <IntroTitle top>
                            {title}
                        </IntroTitle>
                    </Only>

                    {children}
                </div>
            </Scroller>
        </motion.div>
    )
}