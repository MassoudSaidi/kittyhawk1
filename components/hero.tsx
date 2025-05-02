import { Flex, Text, Button } from "@radix-ui/themes";
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Financial Freedom Starts Here</div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Expert Financial Consultation Tailored For You
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                We help you make informed financial decisions. Our expert consultants provide personalized advice to
                achieve your financial goals.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full blur-2xl opacity-20"></div>
                <img
                  src="https://placehold.co/500x500?text=Integrated"
                  alt="Financial dashboard visualization"
                  className="relative w-full h-auto rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>    
    </div>
  );
}
