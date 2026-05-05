import AccountTabs from '@/Components/AccountTabs'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React from 'react'

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Header />
      <main className="flex-1 pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <AccountTabs />
      </main>
      <Footer />
    </div>
  )
}
