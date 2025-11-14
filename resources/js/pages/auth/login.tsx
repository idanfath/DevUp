import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Code2, Sparkles, Zap, Trophy } from 'lucide-react';
import '@/../../resources/css/animations.css';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <>
            <Head title="Log in">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <div className="select-none min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                    <Zap className="absolute top-20 left-1/4 w-8 h-8 text-yellow-400 animate-pulse" />
                    <Trophy className="absolute bottom-32 right-1/4 w-10 h-10 text-orange-400 animate-bounce" style={{ animationDuration: '3s' }} />
                    <Code2 className="absolute top-1/3 right-20 w-12 h-12 text-blue-400" style={{ animation: 'blob 5s infinite' }} />
                </div>

                <div className="relative z-10 w-full max-w-md px-6">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold">Welcome Back, Coder! 👋</span>
                        </div>

                        <h1 className="text-3xl font-black mb-2">
                            Ready to <span className="text-yellow-400">Battle?</span>
                        </h1>
                        <p className="text-gray-300">Login dan tunjukkan skill coding kamu!</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                        {status && (
                            <div className="mb-6 text-center text-sm font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl py-3 px-4">
                                ✨ {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div>
                                                <Label htmlFor="email" className="text-white font-semibold">
                                                    Email Address
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="your.email@example.com"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400  rounded-xl"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-white font-semibold">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <Link
                                                        href={request()}
                                                        className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                                                        tabIndex={5}
                                                    >
                                                        Lupa password?
                                                    </Link>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.password}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3 cursor-pointer w-fit ">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-white/30 data-[state=checked]:bg-yellow-400 cursor-pointer data-[state=checked]:border-yellow-400"
                                            />
                                            <Label htmlFor="remember" className="text-gray-300 font-medium cursor-pointer">
                                                Remember me
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className=" w-full cursor-pointer bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 rounded-xl transition-all hover:scale-105 shadow-lg text-base"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2" />
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    🚀 Let's Go!
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {canRegister && (
                                        <div className="text-center text-sm">
                                            <span className="text-gray-300 mr-1">Belum punya akun?</span>
                                            <Link
                                                href={register()}
                                                className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
                                                tabIndex={6}
                                            >
                                                Daftar sekarang! 🎮
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="text-center mt-6 text-gray-400 text-sm">
                        <p>Code. Compete. Level Up! 💪</p>
                    </div>
                </div>
            </div>
        </>
    );
}
