
import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import Link from 'next/link'
import PageLayout from '../components/PageLayout'
import React, { useEffect, useState } from 'react'
import { Interface } from 'readline'
import type { GetServerSideProps, NextPage } from 'next'
import { Button, Form, Input } from 'antd'
import { notStrictEqual } from 'assert'

// import { createSample } from '../scripts/script'

interface FormData {
  appraise: number,
  department: string,
  city: string
}

interface Predios {
  predios: {
    id: number,
    department: string,
    city: string,
    appraise: number
  }[]
}

type LayoutType = Parameters<typeof Form>[0]['layout'];

const Home: NextPage<Predios> = ({ predios }) => {




  return (
    <PageLayout>

    </PageLayout>
  )
}


export default Home;
