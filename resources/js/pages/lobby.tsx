import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    GamepadIcon,
    TrophyIcon,
    ZapIcon,
    PlayIcon,
    ClockIcon,
    TargetIcon,
    CodeIcon,
    CalendarIcon,
    TrendingUpIcon,
    XCircleIcon
} from 'lucide-react';
import { useInitials } from '@/hooks/use-initials';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/lobby',
    },
];

interface GameHistory {
    id: number;
    total_score: number;
    language: string;
    difficulty: string;
    gametype: string;
    round: number;
    created_at: string;
    duration: number | null;
}

interface OngoingGame {
    id: number;
    language: string;
    difficulty: string;
    gametype: string;
    round: number;
    total_score: number;
    current_round: number;
    created_at: string;
}

interface Props {
    ongoingGame: OngoingGame | null;
    recentGames: GameHistory[];
    mostUsedLanguage: string | null;
}

export default function Lobby({ ongoingGame, recentGames, mostUsedLanguage }: Props) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [isTerminating, setIsTerminating] = useState(false);

    const handleTerminateGame = () => {
        if (!confirm('Apakah Anda yakin ingin menghentikan game ini? Progress Anda akan hilang.')) {
            return;
        }

        setIsTerminating(true);
        router.post('/game/terminate', {}, {
            onFinish: () => setIsTerminating(false)
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'hard':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="m-4 space-y-6">
                {/* User Stats Banner */}
                <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-purple-500/20">
                    <CardContent className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-2 border-neutral-700">
                                    <AvatarImage
                                        src={auth.user.profile_path ? `/storage/${auth.user.profile_path}` : undefined}
                                        alt={auth.user.username}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(auth.user.nickname || auth.user.username)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-3xl font-bold">
                                        {auth.user.nickname || auth.user.username}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Siap coding dan berkembang!
                                    </p>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Ongoing Game Alert */}
                {ongoingGame && (
                    <Card className="border-2 border-orange-500/50 bg-orange-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <ClockIcon className="size-5" />
                                Game Sedang Berjalan
                            </CardTitle>
                            <CardDescription>Kamu punya challenge yang belum selesai</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500/10">
                                        <CodeIcon className="size-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="capitalize">{ongoingGame.language}</Badge>
                                            <Badge variant="secondary">{ongoingGame.difficulty}</Badge>
                                            <Badge>{ongoingGame.gametype === 'debug' ? 'Debug' : 'Problem Solving'}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Round {ongoingGame.current_round} of {ongoingGame.round} • Score: {ongoingGame.total_score}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="lg"
                                        variant="destructive"
                                        onClick={handleTerminateGame}
                                        disabled={isTerminating}
                                    >
                                        <XCircleIcon className="mr-2" />
                                        {isTerminating ? 'Menghentikan...' : 'Hentikan'}
                                    </Button>
                                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                                        <Link href="/game/play">
                                            <PlayIcon className="mr-2" />
                                            Lanjutkan Game
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    {!ongoingGame && (
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20 hover:border-primary/40"
                            onClick={() => window.location.href = '/game/configure'}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <PlayIcon className="size-8 text-primary" />
                                    </div>
                                    Mulai Challenge Baru
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Uji kemampuan coding kamu dengan challenge dari AI
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        Pilih dari 10+ bahasa pemrograman
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        3 tingkat kesulitan: Easy, Medium, Hard
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        Challenge Debug atau Problem Solving
                                    </li>
                                </ul>
                                <Button className="w-full mt-4" size="lg">
                                    <PlayIcon className="mr-2" />
                                    Ayo Coding!
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUpIcon className="size-5" />
                                Progress Kamu
                            </CardTitle>
                            <CardDescription>Terus maju ke depan!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <TargetIcon className="size-5 text-blue-500" />
                                        <span className="font-medium">Total Game</span>
                                    </div>
                                    <span className="text-xl font-bold">{recentGames.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ZapIcon className="size-5 text-yellow-500" />
                                        <span className="font-medium">Rata-rata Skor</span>
                                    </div>
                                    <span className="text-xl font-bold">
                                        {recentGames.length > 0
                                            ? Math.round(recentGames.reduce((sum, g) => sum + g.total_score, 0) / recentGames.length)
                                            : 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CodeIcon className="size-5 text-purple-500" />
                                        <span className="font-medium">Bahasa Paling Sering</span>
                                    </div>
                                    <span className="text-xl font-bold capitalize">
                                        {mostUsedLanguage || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Games */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ClockIcon className="size-5" />
                                    Game Terbaru
                                </CardTitle>
                                <CardDescription>Challenge coding terakhir kamu</CardDescription>
                            </div>
                            {recentGames.length > 0 && (
                                <Button variant="outline" asChild>
                                    <Link href="/game/history">
                                        Lihat Semua Riwayat
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentGames.length === 0 ? (
                            <div className="text-center py-12">
                                <GamepadIcon className="size-16 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">Belum ada game yang dimainkan</p>
                                <Button asChild>
                                    <Link href="/game/configure">
                                        <PlayIcon className="mr-2" />
                                        Mulai Challenge Pertama
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentGames.map((game) => (
                                    <Link
                                        key={game.id}
                                        href={`/game/results/${game.id}`}
                                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors border cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <CodeIcon className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="capitalize">
                                                        {game.language}
                                                    </Badge>
                                                    <Badge className={getDifficultyColor(game.difficulty)}>
                                                        {game.difficulty}
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        {game.gametype === 'debug' ? 'Debug' : 'Problem Solving'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <CalendarIcon className="size-3" />
                                                    {formatDate(game.created_at)}
                                                    {game.duration && (
                                                        <>
                                                            <span>•</span>
                                                            <ClockIcon className="size-3" />
                                                            {game.duration} min
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-2xl font-bold">
                                                <TrophyIcon className="size-5 text-yellow-500" />
                                                {game.total_score}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {game.round} ronde
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
