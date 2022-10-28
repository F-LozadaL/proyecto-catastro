import Head from "next/head"
import Link from "next/link"

export default function PageLayout({ children, title = 'Catastro - App' }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Aplicacion crud catastro" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <div><Link href="/">Home</Link></div>
                <div><Link href="/predio">Predios</Link></div>
                <div><Link href="/owner">Propietarios</Link></div>
                <div><Link href="/building">Construcciones</Link></div>
                <div><Link href="/land">Terreno</Link></div>
            </header>

            <main>
                {children}
            </main>

            <style jsx>{`
            header{
                padding: 20px;
                display: flex;
                justify-content: space-between;    
            }
        `} </style>
        </>
    )
}