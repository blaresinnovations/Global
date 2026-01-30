import React from 'react'
import Carousel from '../components/Carousel'
import AboutGlobal from '../components/AboutGlobal'
import WhyGlobalGate from '../components/WhyGlobalGate'
import OurCourses from '../components/OurCourses'
import Blogs from '../components/Blogs'

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '00px' }}>
      <Carousel />
      <AboutGlobal />
      <OurCourses />
      <WhyGlobalGate />
      
      <Blogs />
    </div>
  )
}

export default Home