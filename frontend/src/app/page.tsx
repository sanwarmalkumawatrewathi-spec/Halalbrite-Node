
import Eventpage from '@/app/eventpage/page'
import Footer from '@/Components/Footer'

import Header from '@/Components/Header'
import Herosections from '@/Components/Herosections'
import MapComponent from '@/Components/MapComponent'
import React from 'react'




export default function page() {
 
  return (
    <div>
      <Header/>
      <Herosections/>

<Eventpage/>
<MapComponent/>
<Footer/>
     
    </div>
  )
}
