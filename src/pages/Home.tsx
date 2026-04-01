import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Membership from '../components/Membership';
import Merchandise from '../components/Merchandise';
import BodyOfWork from '../components/BodyOfWork';
import Podcast from '../components/Podcast';
import Events from '../components/Events';

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <Services />
      <Membership />
      <Merchandise />
      <BodyOfWork />
      <Podcast />
      <Events />
    </main>
  );
}
