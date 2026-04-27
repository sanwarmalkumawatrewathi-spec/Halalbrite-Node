import AccountTabs from '@/Components/AccountTabs'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React from 'react'

export default function AccountPage() {
  return (
    <div suppressHydrationWarning>
      <Header/>
      <section>
        <AccountTabs/>
      </section>
      <Footer/>
    </div>
  )
}
