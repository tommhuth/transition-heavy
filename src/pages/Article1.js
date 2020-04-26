
import React, { useEffect } from "react"
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"


export default function Article1() {
    return (
        <Page>
            <Container>
                <h1>ARTICLE 1</h1>
                <p>Lorem ipsum.</p>

                <Link to="/content" state={{ transitionType: "top" }}>Back</Link>
            </Container>
        </Page>
    )
}