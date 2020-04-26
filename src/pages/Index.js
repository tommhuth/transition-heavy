
import React, { useEffect } from "react"
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"

export default function Index() {
    return (
        <Page>
            <Container>
                <h1>Index</h1>
                <Link to="/" state={{ transitionType: "top" }}>SPLASH [top]</Link>
                <Link to="/article-1" state={{ transitionType: "bottom" }}>ARTICLE 1 [bottom]</Link>
            </Container>
        </Page>
    )
}