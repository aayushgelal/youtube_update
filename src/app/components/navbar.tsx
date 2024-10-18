"use client"
import React, { useEffect } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Rocket } from 'lucide-react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  useEffect(()=> {
    if(isSignedIn)
    redirect('/dashboard')

  },[])

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <Image src="/NOTIFI.png" alt="logo" width={200} height={200} />
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <>
                <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">Features</a>
                  <Button variant="ghost" >                <SignInButton />
</Button>
                  <Button variant="ghost">            <SignUpButton children="Try for Free" />
</Button>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-primary text-primary-foreground">
                <DropdownMenuItem>
                  <a href="#features" className="w-full">Features</a>
                </DropdownMenuItem>
                {isSignedIn ? (
                  <DropdownMenuItem>{user?.fullName}</DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem><SignInButton /></DropdownMenuItem>
                    <DropdownMenuItem><SignUpButton /></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;