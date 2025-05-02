
import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  HelpCircle,
  LineChart,
  Lock,
  PieChart,
  Settings,
  User,
} from "lucide-react"
//import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function ClientArea() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }


  return <Dashboard />
}


function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$253,429.32</div>
            <p className="text-xs text-muted-foreground">+$4,521.25 (1.8%) from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year-to-Date Return</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+12.4%</div>
            <p className="text-xs text-muted-foreground">Benchmark index: +8.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retirement Progress</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">Estimated retirement at age 61</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">April 15</div>
            <p className="text-xs text-muted-foreground">2:00 PM with John Smith</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>View your portfolio performance over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-center justify-center bg-muted rounded-md">
              <LineChart className="h-16 w-16 text-muted-foreground/60" />
              <span className="ml-2 text-muted-foreground">Interactive chart will appear here</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current distribution by asset class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center bg-muted rounded-md">
              <PieChart className="h-16 w-16 text-muted-foreground/60" />
              <span className="ml-2 text-muted-foreground">Interactive chart will appear here</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Overview of your current financial position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Assets</div>
                  <div className="text-xl font-bold">$453,672.89</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Liabilities</div>
                  <div className="text-xl font-bold">$200,243.57</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Net Worth</div>
                  <div className="text-xl font-bold">$253,429.32</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-primary/10">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Investment Deposit</p>
                            <p className="text-xs text-muted-foreground">March {10 + i}, 2023</p>
                          </div>
                          <div className="text-sm font-medium">+$1,500.00</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-yellow-500/10">
                          <HelpCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Review New Investment Proposal</p>
                          <p className="text-xs text-muted-foreground">Due by April 15, 2023</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-green-500/10">
                          <Lock className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Update Security Settings</p>
                          <p className="text-xs text-muted-foreground">Recommended action</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View Full Financial Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Manage and track your investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <BarChart3 className="h-16 w-16 text-muted-foreground/60" />
                <span className="ml-2 text-muted-foreground">Investment portfolio details will appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Planning</CardTitle>
              <CardDescription>View your financial goals and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <Settings className="h-16 w-16 text-muted-foreground/60" />
                <span className="ml-2 text-muted-foreground">Financial planning tools will appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Center</CardTitle>
              <CardDescription>Access and manage your important financial documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <span className="text-muted-foreground">Your secure documents will appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <Settings className="h-16 w-16 text-muted-foreground/60" />
                <span className="ml-2 text-muted-foreground">Account settings will appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

