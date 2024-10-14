"use client"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useUser } from '@clerk/nextjs'
import ButtonSheetNewAccount from '@/features/accounts/components/button-sheet-new-account'
import ButtonSheetNewTransaction from '@/features/transactions/components/button-sheet-new-transaction'
import ButtonConnectToBank from './button-connect-to-bank'

export default function WelcomeCard() {
    const {user ,isLoaded} = useUser()
  return (
    <Card
    className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
  >
    <CardHeader className="pb-3">
      <CardTitle>Welcome Back {isLoaded ? ", " : " "}{user?.firstName} 👋</CardTitle>
      <CardDescription className="max-w-lg text-balance leading-relaxed">
        This is yout Financial Overview Report
      </CardDescription>
    </CardHeader>
    <CardFooter className='flex gap-x-2 md:flex-row'>

      <ButtonConnectToBank/>
      <ButtonSheetNewTransaction/>
      <ButtonSheetNewAccount />
    </CardFooter>
  </Card>
  )
}



