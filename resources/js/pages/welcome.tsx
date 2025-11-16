import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Code2,
    Zap,
    Trophy,
    Users,
    Brain,
    Sparkles,
    Play,
    ArrowRight,
    Bug,
    Lightbulb,
    Target,
    GamepadIcon,
    type LucideIcon
} from 'lucide-react';
import { type ReactNode } from 'react';
import '@/../../resources/css/animations.css';
import AppLogo from '@/components/app-logo';

// Reusable Components
interface GradientButtonProps {
    href: any; // Can be string or route definition
    children: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const GradientButton = ({ href, children, className = '', size = 'md' }: GradientButtonProps) => {
    const sizeClasses = {
        sm: 'px-6 py-2.5 text-base',
        md: 'px-8 py-4 text-lg',
        lg: 'px-10 py-5 text-xl'
    };

    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 text-white bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl font-bold transition-all hover:scale-105 shadow-2xl ${sizeClasses[size]} ${className}`}
        >
            {children}
        </Link>
    );
};

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradientFrom, gradientTo }: FeatureCardProps) => {
    return (
        <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:border-yellow-400/50">
            <div className={`bg-linear-to-br ${gradientFrom} ${gradientTo} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform`}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
    );
};

interface StepCardProps {
    num: string;
    icon: LucideIcon;
    title: string;
    description: string;
    showArrow: boolean;
}

const StepCard = ({ num, icon: Icon, title, description, showArrow }: StepCardProps) => {
    return (
        <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                    {num}
                </div>
                <div className="mt-4 mb-4 inline-flex">
                    <Icon className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="text-xl font-bold mb-2">{title}</h4>
                <p className="text-gray-300 text-sm">{description}</p>
            </div>
            {showArrow && (
                <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-linear-to-l from-yellow-400/50 to-transparent"></div>
            )}
        </div>
    );
};

// Animated blob background component
const AnimatedBlobs = () => {
    const blobs = [
        { color: 'bg-purple-500', position: 'top-20 left-10', delay: '' },
        { color: 'bg-yellow-500', position: 'top-40 right-10', delay: 'animation-delay-2000' },
        { color: 'bg-pink-500', position: '-bottom-8 left-20', delay: 'animation-delay-4000' },
        { color: 'bg-blue-500', position: 'top-1/2 left-1/2', delay: 'animation-delay-6000', size: 'w-96 h-96', opacity: 'opacity-10' }
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    className={`absolute ${blob.position} ${blob.size || 'w-72 h-72'} ${blob.color} rounded-full mix-blend-multiply filter blur-xl ${blob.opacity || 'opacity-20'} animate-blob ${blob.delay}`}
                />
            ))}
        </div>
    );
};

// Section title component
interface SectionTitleProps {
    children: ReactNode;
    subtitle?: string;
}

const SectionTitle = ({ children, subtitle }: SectionTitleProps) => {
    return (
        <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">{children}</h2>
            {subtitle && <p className="text-xl text-gray-300">{subtitle}</p>}
        </div>
    );
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Bug,
            title: 'Debug Challenge',
            description: 'Temukan bug dan fix code yang error. Race against time untuk score terbaik!',
            gradientFrom: 'from-purple-500',
            gradientTo: 'to-pink-500'
        },
        {
            icon: Lightbulb,
            title: 'Problem Solving',
            description: 'Build solution dari scratch. Test logic dan creativity kamu!',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-cyan-500'
        },
        {
            icon: Brain,
            title: 'AI Juri',
            description: 'AI yang smart bakal ngasih score dan feedback. Fair dan objective!',
            gradientFrom: 'from-yellow-500',
            gradientTo: 'to-orange-500'
        },
        {
            icon: Users,
            title: 'Practice Mode',
            description: 'Latihan coding dengan berbagai challenge. Improve skill kamu!',
            gradientFrom: 'from-green-500',
            gradientTo: 'to-emerald-500'
        },
        {
            icon: Zap,
            title: 'Multi-Round Challenges',
            description: '1, 3, 5, atau 7 rounds? You decide! Makin banyak ronde, makin seru!',
            gradientFrom: 'from-red-500',
            gradientTo: 'to-rose-500'
        },
        {
            icon: Target,
            title: 'Learn & Improve',
            description: 'Dapetin insight setelah tiap ronde. Belajar dari mistake, jadi makin jago!',
            gradientFrom: 'from-indigo-500',
            gradientTo: 'to-purple-500'
        }
    ];

    const steps = [
        {
            num: '1',
            icon: GamepadIcon,
            title: 'Configure Game',
            desc: 'Pilih bahasa, difficulty, dan jumlah rounds'
        },
        {
            num: '2',
            icon: Code2,
            title: 'Pick Your Weapon',
            desc: 'Pilih bahasa coding & mode: Debug atau Problem Solving'
        },
        {
            num: '3',
            icon: Trophy,
            title: 'Code & Solve',
            desc: 'Race against time, submit solution secepat dan seakurat mungkin!'
        },
        {
            num: '4',
            icon: Sparkles,
            title: 'Get Feedback',
            desc: 'AI kasih score + penjelasan. Belajar dari setiap challenge!'
        }
    ];

    return (
        <>
            <Head title="Welcome to DevUp">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen select-none bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <AnimatedBlobs />

                {/* Beta Notice Banner */}
                <div className="relative z-20 bg-yellow-400 text-black py-2 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-sm font-semibold flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>🚧 Beta Version: App masih dalam skala kecil. AI generation mungkin terbatas atau lambat. Thanks for your patience! 🙏</span>
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-3">
                        {/* <span className="text-3xl font-black tracking-tight">
                            Dev<span className="text-yellow-400">Up</span>
                        </span> */}
                        <AppLogo theme="light" />
                    </Link>

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={auth.user.role == 'admin' ? dashboard() : '/game/configure'}
                                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all hover:scale-105"
                            >
                                {auth.user.role == 'admin' ? 'Dashboard' : 'Start Game'}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-6 py-2.5 hover:bg-white/10 rounded-xl font-semibold transition-all"
                                >
                                    Login
                                </Link>
                                <GradientButton href={register()} size="sm">
                                    Get Started
                                </GradientButton>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 max-w-7xl mx-auto px-6 pt-4 ">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold">AI-Powered Coding Arena</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                            Code. Compete.
                            <br />
                            <span className="bg-linear-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
                                Level Up!
                            </span>
                            🚀
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Asah skill coding kamu lewat challenges seru! Debug, solve, dan improve.
                            Nikmati pengalaman belajar <span className="text-yellow-400 font-bold">interaktif dan seru!</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <GradientButton href={auth.user ? (auth.user.role == 'admin' ? dashboard() : '/game/configure') : login()} className="group">
                                <Play className="w-5 h-5" />
                                Start Playing
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </GradientButton>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} {...feature} />
                        ))}
                    </div>

                    {/* How It Works Section */}
                    <div className="mt-32">
                        <SectionTitle subtitle="Simple banget! Langsung gas aja 🔥">
                            How It <span className="text-yellow-400">Works?</span>
                        </SectionTitle>

                        <div className="grid md:grid-cols-4 gap-8">
                            {steps.map((step, i) => (
                                <StepCard
                                    key={i}
                                    num={step.num}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.desc}
                                    showArrow={i < 3}
                                />
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-32 bg-linear-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Ready to <span className="text-yellow-400">Level Up?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join ribuan developers yang udah improve skill mereka.
                            Coding nggak harus boring, bisa fun kok! 🎮
                        </p>
                        <GradientButton href={auth.user ? (auth.user.role == 'admin' ? dashboard() : '/game/configure') : login()} size="lg">
                            <Play className="w-6 h-6" />
                            Start Your Journey
                            <ArrowRight className="w-6 h-6" />
                        </GradientButton>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
                    <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
                        <p className="text-sm">
                            © 2025 DevUp. Made for Sevent 9.0 with ❤️ for developers who love to compete and learn.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
