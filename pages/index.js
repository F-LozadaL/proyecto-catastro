
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import PageLayout from '../components/PageLayout'
import { useEffect, useState } from 'react'

export default function Home({ articles }) {



  return (
    <PageLayout title='Catastro - Home'>
      <div className={styles.container}>
        {articles.length == 0 && <p>No tenemos articulos</p>}
        {articles.length > 0 && articles.map((article, index) =>
          <div key={index}>

            <Image src={article.urlToImage} alt={`Image for the article ${article.title}`}
              width={400} height={250} layout='responsive' />
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </div>


        )}
      </div>
    </PageLayout>
  )
}

// N request -> se ejecuta 1 vez en buildtime (o para refrescar la pagina)
// export async function getStaticProps(context) {
//   const response = await fetch('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=74d35bf84f674f6286de8a2c08d9e341')
//   const { articles } = await response.json()
//   return {
//     props: {
//       articles
//     }
//   }
// }

export async function getServerSideProps(context) {
  const response = await fetch('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=74d35bf84f674f6286de8a2c08d9e341')
  const { articles } = await response.json()
  return {
    props: {
      articles
    }
  }
}