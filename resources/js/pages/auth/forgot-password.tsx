// Components
import { home, login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Code2, Sparkles, Zap, Trophy, KeyRound } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import '@/../../resources/css/animations.css';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password">
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
                    <KeyRound className="absolute bottom-1/4 left-1/4 w-10 h-10 text-pink-400" style={{ animation: 'blob 6s infinite' }} />
                </div>

                <div className="relative z-10 w-full max-w-md px-6">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold">Reset Password 🔑</span>
                        </div>

                        <h1 className="text-3xl font-black mb-2">
                            Lupa <span className="text-yellow-400">Password?</span>
                        </h1>
                        <p className="text-gray-300">Kami akan kirimkan kamu instruksi untuk reset password, ya!</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                        {status && (
                            <div className="mb-6 text-center text-sm font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl py-3 px-4">
                                ✨ {status}
                            </div>
                        )}

                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div>
                                                <Label htmlFor="email" className="text-white font-semibold">
                                                    Email Address
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                autoComplete="off"
                                                autoFocus
                                                placeholder="your.email@example.com"
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400  rounded-xl"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.email}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className=" w-full cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 rounded-xl transition-all hover:scale-105 shadow-lg text-base"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    📧 Send Reset Link
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm mt-6">
                                        <span className="text-gray-300 mr-1">Ingat password kamu?</span>
                                        <Link
                                            href={login()}
                                            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
                                        >
                                            Login di sini! 🎯
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="text-center mt-6 text-gray-400 text-sm">
                        <p>We got your back! 💪</p>
                    </div>
                </div>
            </div>
        </>
    );
}
