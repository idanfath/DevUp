import { home, login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Code2, Sparkles, Zap, Trophy, Rocket } from 'lucide-react';
import '@/../../resources/css/animations.css';

export default function Register() {
    return (
        <>
            <Head title="Register">
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
                    <Rocket className="absolute bottom-1/4 left-1/4 w-10 h-10 text-pink-400" style={{ animation: 'blob 6s infinite' }} />
                </div>

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold">Join the Arena! 🎮</span>
                        </div>

                        <h1 className="text-3xl font-black mb-2">
                            Start Your <span className="text-yellow-400">Journey</span>
                        </h1>
                        <p className="text-gray-300">Daftar sekarang dan buktikan skill kamu!</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <div>
                                                <Label htmlFor="username" className="text-white font-semibold">
                                                    Username
                                                </Label>
                                            </div>
                                            <Input
                                                id="username"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                name="username"
                                                placeholder="Nama lengkap kamu"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400  rounded-xl"
                                            />
                                            {errors.username && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.username}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div>
                                                <Label htmlFor="email" className="text-white font-semibold">
                                                    Email Address
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="your.email@example.com"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400  rounded-xl"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div>
                                                <Label htmlFor="password" className="text-white font-semibold">
                                                    Password
                                                </Label>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Minimal 8 karakter"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div>
                                                <Label htmlFor="password_confirmation" className="text-white font-semibold">
                                                    Confirm Password
                                                </Label>
                                            </div>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Ulangi password kamu"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20 rounded-xl"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.password_confirmation}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-2 w-full cursor-pointer bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 rounded-xl transition-all hover:scale-105 shadow-lg text-base"
                                            tabIndex={5}
                                            disabled={processing}
                                            data-test="register-user-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    🚀 Create Account
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm">
                                        <span className="text-gray-300 mr-1">Sudah punya akun?</span>
                                        <Link
                                            href={login()}
                                            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
                                            tabIndex={6}
                                        >
                                            Login di sini! 🎯
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="text-center mt-6 text-gray-400 text-sm">
                        <p>Join ribuan coders lainnya! 💪</p>
                    </div>
                </div>
            </div>
        </>
    );
}
