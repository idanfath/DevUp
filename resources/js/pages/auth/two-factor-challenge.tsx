import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import { Code2, Sparkles, Zap, Trophy, Shield } from 'lucide-react';
import '@/../../resources/css/animations.css';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Masukkan salah satu recovery code darurat kamu.',
                toggleText: 'login dengan kode autentikasi',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Masukkan kode autentikasi dari aplikator authenticator kamu.',
            toggleText: 'login dengan recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Two-Factor Authentication">
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
                    <Shield className="absolute bottom-1/4 left-1/4 w-10 h-10 text-green-400" style={{ animation: 'blob 6s infinite' }} />
                </div>

                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold">Verifikasi Akun 🔐</span>
                        </div>

                        <h1 className="text-3xl font-black mb-2">
                            <span className="text-yellow-400">{authConfigContent.title}</span>
                        </h1>
                        <p className="text-gray-300">{authConfigContent.description}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                        <Form
                            {...store.form()}
                            className="space-y-6"
                            resetOnError
                            resetOnSuccess={!showRecoveryInput}
                        >
                            {({ errors, processing, clearErrors }) => (
                                <>
                                    {showRecoveryInput ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="recovery_code" className="text-white font-semibold">
                                                Recovery Code
                                            </Label>
                                            <Input
                                                id="recovery_code"
                                                name="recovery_code"
                                                type="text"
                                                placeholder="Masukkan recovery code"
                                                autoFocus={showRecoveryInput}
                                                required
                                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-yellow-400 rounded-xl"
                                            />
                                            {errors.recovery_code && (
                                                <p className="text-sm text-red-400 font-medium">⚠️ {errors.recovery_code}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label className="text-white font-semibold block text-center">
                                                Kode Autentikasi
                                            </Label>
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="flex w-full items-center justify-center">
                                                    <InputOTP
                                                        name="code"
                                                        maxLength={OTP_MAX_LENGTH}
                                                        value={code}
                                                        onChange={(value) => setCode(value)}
                                                        disabled={processing}
                                                        pattern={REGEXP_ONLY_DIGITS}
                                                    >
                                                        <InputOTPGroup className="gap-2">
                                                            {Array.from(
                                                                { length: OTP_MAX_LENGTH },
                                                                (_, index) => (
                                                                    <InputOTPSlot
                                                                        key={index}
                                                                        index={index}
                                                                        className="bg-white/5 border-white/20 text-white w-12 h-14 text-xl font-bold rounded-xl"
                                                                    />
                                                                ),
                                                            )}
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </div>
                                                {errors.code && (
                                                    <p className="text-sm text-red-400 font-medium">⚠️ {errors.code}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 rounded-xl transition-all hover:scale-105 shadow-lg text-base"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-2" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                🚀 Continue
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center text-sm">
                                        <span className="text-gray-300 mr-1">atau </span>
                                        <button
                                            type="button"
                                            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors cursor-pointer"
                                            onClick={() =>
                                                toggleRecoveryMode(clearErrors)
                                            }
                                        >
                                            {authConfigContent.toggleText} 🔄
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <div className="text-center mt-6 text-gray-400 text-sm">
                        <p>Keamanan akun adalah prioritas! 🛡️</p>
                    </div>
                </div>
            </div>
        </>
    );
}
