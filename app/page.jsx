//app/page.jsx
import Hero from './components/sections/Hero';
import FeaturedProperties from './components/sections/FeaturedProperties';
import MapSearch from './components/sections/MapSearch';
import Neighborhoods from './components/sections/Neighborhoods';
import Testimonials from './components/sections/Testimonials';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Newsletter from './components/sections/Newsletter';


export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <MapSearch />
      <Neighborhoods />
      <Testimonials />
      <About />
      <Contact />
      <Newsletter />
    </>
  );
}