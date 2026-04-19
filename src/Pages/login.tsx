import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import * as z from "zod"
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
} from "lucide-react"
import { authService } from "../Services/services"
import { useAuth } from "../Context/AuthContext"

import { Button } from "@/Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field"
import { Input } from "@/Components/ui/input"

// ─── Validation Schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Decorative Stat Card ─────────────────────────────────────────────────────
function StatBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3.5 py-1.5 text-[13px] text-white font-medium">
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(_data: LoginFormValues) {
    const { email, password } = _data
    setLoginError("")
    setIsLoading(true)
    try {
      const res = await authService.login({ email, password })
      login(res.data.token, res.data.user)
      navigate("/")
    } catch (error: any) {
      setLoginError(error?.response?.data?.message || "Invalid credentials. Please try again.")
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-12 items-center justify-center relative overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute rounded-full blur-[72px] opacity-35 pointer-events-none w-80 h-80 bg-indigo-400 -top-16 -right-16 animate-pulse" />
        <div className="absolute rounded-full blur-[72px] opacity-35 pointer-events-none w-64 h-64 bg-fuchsia-400 -bottom-10 -left-10 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-md flex flex-col gap-6">
          {/* Logo with glow effect */}
          <div className="w-[52px] h-[52px] rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <GraduationCap size={28} color="#fff" />
          </div>

          <p className="text-white/90 text-[13px] font-semibold tracking-widest uppercase m-0">
            EduPlatform
          </p>

          <h2 className="text-white text-4xl lg:text-5xl font-extrabold leading-tight m-0">
            Unlock your
            <br />
            <span className="bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-transparent">
              full potential
            </span>
          </h2>

          <p className="text-white/80 text-base leading-relaxed m-0 max-w-sm">
            Join thousands of learners transforming their futures through
            world-class online education.
          </p>

          {/* Enhanced Stats */}
          <div className="flex flex-wrap gap-3">
            <StatBadge emoji="🎓" label="50k+ Students" />
            <StatBadge emoji="📚" label="200+ Courses" />
            <StatBadge emoji="⭐" label="4.9 Rating" />
          </div>

          {/* Enhanced floating cards */}
          <div className="flex items-center gap-3 bg-white/95 rounded-xl p-4 shadow-2xl mt-2 max-w-[280px] backdrop-blur-sm hover:shadow-3xl transition-shadow duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[11px] font-medium m-0 uppercase tracking-wider">
                Today's lesson
              </p>
              <p className="text-gray-900 text-sm font-semibold m-0">
                Advanced React Patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="w-full lg:w-[460px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={22} className="text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-2">
              Sign in to continue your learning journey
            </CardDescription>
            {loginError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {loginError}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup>
                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="login-email" className="text-left">
                        Email address
                      </FieldLabel>
                      <div className="relative flex items-center">
                        <Mail
                          size={16}
                          className="absolute left-3 pointer-events-none text-gray-400"
                        />
                        <Input
                          {...field}
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                          className="pl-10 pr-10 w-full h-12 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-black placeholder-gray-400 bg-white transition-all duration-200"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="login-password" className="text-left">
                        Password
                      </FieldLabel>
                      <div className="relative flex items-center">
                        <Lock
                          size={16}
                          className="absolute left-3 pointer-events-none text-gray-400"
                        />
                        <Input
                          {...field}
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          aria-invalid={fieldState.invalid}
                          className="pl-10 pr-10 w-full h-12 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-black placeholder-gray-400 bg-white transition-all duration-200"
                        />
                        <button
                          type="button"
                          id="toggle-password"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 bg-transparent border-none cursor-pointer flex items-center p-0 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Forgot password */}
                <div className="text-right -mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 no-underline font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button
              id="login-submit"
              type="submit"
              form="login-form"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 border-none flex items-center justify-center gap-2 cursor-pointer text-white hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
