import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Youtube, Mail, Clock, Sparkles, Rocket } from 'lucide-react';
import Navbar from '../components/navbar';
import { SignUpButton, useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

const FeatureCard = ({ icon, title, description }:any) => (
  <Card className="bg-white shadow-lg hover:shadow-xl ease-in  hover:scale-105 transition-all cursor-pointer duration-300">
    <CardHeader>
      <CardTitle className="flex items-center text-primary">
        {icon}
        <span className="ml-2">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-secondary">{description}</p>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const {userId}=auth()
  if(userId){
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light ">
      
      {/* Hero Section */}
      <section className="py-20 px-14">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Stay Updated with Your Favorite YouTube Creators</h1>
            <p className="text-xl mb-8 text-secondary-light">Get daily summaries of the latest videos, right in your inbox!</p>
            <Button size="lg" variant={'default'} className='min-w-60'>
            🚀 <SignUpButton children="Try for Free" /> 
            </Button>
          </div>
          <div className="md:w-1/2 w-screen p-4 ">
            <div className="bg-white rounded-lg shadow-2xl  aspect-video flex items-center justify-center">
              <video src="Notifi.mp4" autoPlay muted  className='rounded-lg' playsInline loop/>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-14 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Youtube size={24} />}
              title="Curated Content"
              description="Receive summaries of videos from your hand-picked list of favorite creators."
            />
            <FeatureCard 
              icon={<Mail size={24} />}
              title="Daily Digest"
              description="Get a neatly organized email every day with the latest updates."
            />
            <FeatureCard 
              icon={<Clock size={24} />}
              title="Time-Saving"
              description="Quick summaries help you decide which videos to watch in full."
            />
            <FeatureCard 
              icon={<Sparkles size={24} />}
              title="Personalized"
              description="Tailor your digest to match your interests and preferences."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20  bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Stay in the Loop?</h2>
          <p className="text-xl mb-8">Join now and never miss an update from your favorite YouTube creators!</p>
          <Button size="lg" className=" text-white hover:bg-secondary-dark">
            <SignUpButton children="Sign Up Now" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;