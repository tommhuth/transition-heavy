import React from "react"
import Page from "../components/Page"
import {Link} from "@reach/router"

export default function Home() {
    return (
        <Page>
            <div
                style={{
                    padding: "0 5em",
                    margin: "-3em",
                    minHeight: "100vh",
                    backgroundColor: "orange",
                    color: "#FFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"

                }}
            >
                <h1>Splash screen</h1>
                <p>Lorem ipsum dolor</p>

                <Link to="/table-of-contents">Next</Link>
            </div>
        </Page>
    )
}