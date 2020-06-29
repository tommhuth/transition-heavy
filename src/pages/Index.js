
import React, { useEffect } from "react"
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"
import Title from "../components/Title"

export default function Index({ path }) {
    return (
        <Page path={path} hasAdjacent >
            <Container>
                <h1 className="h2">Index</h1>
                <p className="p2">Ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis dapibus sodales. Maecenas vi amet erat posuere accumsan. Praesent lacus tellus, faucibus tincidunt varius non, condimentum vitae mi. </p>
                <p className="p">Ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis dapibus sodales. Maecenas vi amet erat posuere accumsan. Praesent lacus tellus, faucibus tincidunt varius non, condimentum vitae mi. </p>

                <ul>
                    <li>
                        <Link to="/" state={{ transitionType: "top" }}>Splashscreen</Link>
                    </li>
                    <li>
                        <Link to="/table-of-contents" state={{ transitionType: "bottom" }}>Index</Link>
                    </li>
                    <li>
                        <Link to="/article-1" state={{ transitionType: "bottom" }}>Article 1</Link>
                    </li>
                    <li>
                        <Link to="/article-2" state={{ transitionType: "bottom" }}>Article 2</Link>
                    </li>
                </ul>

            </Container>

            <Title
                next
                url={"/article-1"}
                backgroundColor="#CCC"
            >
                Ipsum dolor sit amet
            </Title>
        </Page>
    )
}