import React from "react";
import { Head, Html, Main, NextScript } from "next/document";


const Document: React.FC = () => (
    <Html>
        <Head>
            <link rel={"shortcut icon"} href={"/favicon.ico"} />
            <link
                href={"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"}
                rel={"stylesheet"}
            />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
);

Document.displayName = "Document";

export default Document;
