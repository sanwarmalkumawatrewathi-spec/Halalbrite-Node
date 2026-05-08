import AccountTabs from '@/Components/AccountTabs'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React from 'react'

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 bg-gray-50/50 mb-20">
        <AccountTabs />
      </main>
      <Footer />
    </div>
  )
}
