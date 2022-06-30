import React from "react";
import { Head, Html, Main, NextScript } from "next/document";


const Document: React.FC = () => (
    <Html>
        <Head>
            <link
                // TODO: Reduce amount of font weights to only used ones from variables.scss (RBA-75)
                href={"https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"}
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
