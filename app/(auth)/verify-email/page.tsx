import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Подтвердите email</CardTitle>
        <CardDescription className="text-base">
          Мы отправили письмо с ссылкой для подтверждения на вашу почту.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p>Проверьте папку «Входящие» и «Спам».</p>
          <p className="mt-2">После подтверждения вы сможете войти в систему.</p>
        </div>
        
        <Button variant="outline" asChild className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к входу
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

