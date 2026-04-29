"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock, User, Eye, EyeSlash, SignIn, UserPlus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/contexts/LanguageContext'
import { ConsumerDashboard } from '@/components/ConsumerDashboard'

export function PortalSection() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await signIn('credentials', {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    })
    if (result?.error) {
      toast.error(t.portal.toast.invalidCredentials, {
        description: t.portal.toast.checkCredentials,
      })
    } else {
      toast.success(t.portal.toast.welcomeBack)
      setLoginForm({ email: '', password: '' })
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(t.portal.toast.passwordsMismatch, { description: t.portal.toast.ensureSame })
      setIsLoading(false)
      return
    }
    if (registerForm.password.length < 8) {
      toast.error(t.portal.toast.passwordTooShort, { description: t.portal.toast.passwordMinLength })
      setIsLoading(false)
      return
    }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.fullName,
        company: registerForm.company,
        phone: registerForm.phone,
      }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'register_failed' }))
      if (error === 'email_already_registered') {
        toast.error(t.portal.toast.accountExists, { description: t.portal.toast.useDifferentEmail })
      } else {
        toast.error(t.portal.toast.registrationFailed || 'Registration failed')
      }
      setIsLoading(false)
      return
    }
    const signInResult = await signIn('credentials', {
      email: registerForm.email,
      password: registerForm.password,
      redirect: false,
    })
    if (!signInResult?.error) {
      toast.success(t.portal.toast.accountCreated, {
        description: `${t.portal.toast.welcomeAboard} ${registerForm.fullName}!`,
      })
      setRegisterForm({ fullName: '', email: '', company: '', phone: '', password: '', confirmPassword: '' })
    }
    setIsLoading(false)
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginForm(prev => ({ ...prev, [e.target.id]: e.target.value }))

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRegisterForm(prev => ({ ...prev, [e.target.id]: e.target.value }))

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    )
  }

  if (session?.user) {
    return <ConsumerDashboard onLogout={() => signOut({ redirect: false })} />
  }

  return (
    <div className="flex flex-col gap-6 pb-20 pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.6 }}
        className="flex justify-center"
      >
        <motion.div
          className="p-4 rounded-2xl bg-accent/10"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Lock size={48} weight="duotone" className="text-accent" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 20 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
          {t.portal.title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.portal.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 22 }}
        className="max-w-md mx-auto w-full"
      >
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.portal.signIn}</TabsTrigger>
            <TabsTrigger value="register">{t.portal.register}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t.portal.welcomeBack}</CardTitle>
                <CardDescription>{t.portal.enterCredentials}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.portal.email}</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User size={20} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t.portal.enterEmail}
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        required
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t.portal.password}</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={20} />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t.portal.enterPassword}
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      t.portal.signingIn
                    ) : (
                      <>
                        <SignIn size={20} className="mr-2" />
                        {t.portal.signIn}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t.portal.createAccount}</CardTitle>
                <CardDescription>{t.portal.registerText}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t.portal.fullName}</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={registerForm.fullName}
                      onChange={handleRegisterChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.portal.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="company">{t.portal.company}</Label>
                      <Input
                        id="company"
                        placeholder="Company Inc."
                        value={registerForm.company}
                        onChange={handleRegisterChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.portal.phoneNumber}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+63 9XX..."
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t.portal.password}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t.portal.atLeast6}
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        required
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t.portal.confirmPassword}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t.portal.reEnterPassword}
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      t.portal.creatingAccount
                    ) : (
                      <>
                        <UserPlus size={20} className="mr-2" />
                        {t.portal.createAccount}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
