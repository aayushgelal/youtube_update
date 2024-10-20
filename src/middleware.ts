import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

function customMiddleware(request:NextRequest) {
  if (request.nextUrl.pathname === '/api/cron/daily-transcripts') {
    console.log("Allowing cron job route to pass through");
    return NextResponse.next();
  }

  // Your other custom middleware logic here
  return null;
}

export default clerkMiddleware((auth,req) => {
  const response = customMiddleware(req);
  if (response) {
    return response;
  }
  // If no custom response, let Clerk handle it
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};