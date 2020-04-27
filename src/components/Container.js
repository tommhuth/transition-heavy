
import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import cn from "classnames"

export default function Container({ children, full }) {

    return (
        <motion.div
            className={cn("container", { "container--full": full })}
        >
            {children}
        </motion.div>
    )
}