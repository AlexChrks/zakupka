'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/shared/stores/auth-store'
import { register, RegisterData } from '../services/auth-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountStep } from './AccountStep'
import { CompanyStep } from './CompanyStep'
import { TermsStep } from './TermsStep'

const STEPS = ['Аккаунт', 'Компания', 'Условия'] as const

export function RegisterWizard() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    registrationStep,
    setRegistrationStep,
    registrationData,
    setRegistrationData,
    clearRegistrationData,
  } = useAuthStore()

  const handleAccountSubmit = (data: {
    email: string
    password: string
    fullName: string
  }) => {
    setRegistrationData(data)
    setRegistrationStep(2)
  }

  const handleCompanySubmit = (data: {
    companyName: string
    description?: string
    industry?: string
    location?: string
    contactPhone: string
    contactEmail?: string
    contactPerson?: string
    buyerEnabled: boolean
    supplierEnabled: boolean
  }) => {
    setRegistrationData(data)
    setRegistrationStep(3)
  }

  const handleTermsSubmit = async () => {
    setError(null)
    setIsLoading(true)

    const data: RegisterData = {
      email: registrationData.email!,
      password: registrationData.password!,
      fullName: registrationData.fullName!,
      companyName: registrationData.companyName!,
      companyDescription: registrationData.description,
      industry: registrationData.industry,
      location: registrationData.location,
      contactPhone: registrationData.contactPhone!,
      contactEmail: registrationData.contactEmail,
      contactPerson: registrationData.contactPerson,
      buyerEnabled: registrationData.buyerEnabled ?? false,
      supplierEnabled: registrationData.supplierEnabled ?? false,
    }

    const result = await register(data)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    clearRegistrationData()
    router.push('/verify-email')
  }

  const handleBack = () => {
    setRegistrationStep(Math.max(1, registrationStep - 1))
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">Регистрация</CardTitle>
        <CardDescription>
          Шаг {registrationStep} из {STEPS.length}: {STEPS[registrationStep - 1]}
        </CardDescription>
        
        {/* Progress indicator */}
        <div className="flex gap-2 pt-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index + 1 <= registrationStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {registrationStep === 1 && (
          <AccountStep
            defaultValues={{
              email: registrationData.email || '',
              password: '',
              confirmPassword: '',
              fullName: registrationData.fullName || '',
            }}
            onSubmit={handleAccountSubmit}
          />
        )}

        {registrationStep === 2 && (
          <CompanyStep
            defaultValues={{
              name: registrationData.companyName || '',
              description: registrationData.description || '',
              industry: registrationData.industry || '',
              location: registrationData.location || '',
              contactPhone: registrationData.contactPhone || '',
              contactEmail: registrationData.contactEmail || '',
              contactPerson: registrationData.contactPerson || '',
              buyerEnabled: registrationData.buyerEnabled ?? false,
              supplierEnabled: registrationData.supplierEnabled ?? false,
            }}
            onSubmit={handleCompanySubmit}
            onBack={handleBack}
          />
        )}

        {registrationStep === 3 && (
          <TermsStep
            onSubmit={handleTermsSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
        
        <div className="mt-6 text-center text-sm">
          <Link href="/about" className="text-muted-foreground underline-offset-4 hover:underline hover:text-foreground">
            ← О платформе
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
