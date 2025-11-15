import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    UsersIcon,
    GamepadIcon,
    TrendingUpIcon,
    ActivityIcon,
    TrophyIcon,
    CodeIcon,
    BarChart3Icon,
    CalendarIcon,
    ClockIcon,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Stats {
    totalUsers: number;
    totalGames: number;
    totalRounds: number;
    activeGames: number;
    recentGames: number;
    newUsers: number;
}

interface GameHistory {
    id: number;
    user: { username: string };
    language: string;
    difficulty: string;
    gametype: string;
    total_score: number;
    round: number;
    duration: number;
    completed_at: string;
}

interface TopPerformer {
    id: number;
    username: string;
    total_matches: number;
    wins: number;
    win_rate: number;
}

interface LanguageStat {
    language: string;
    count: number;
}

interface Props {
    stats: Stats;
    gameTypeDistribution: Record<string, number>;
    difficultyDistribution: Record<string, number>;
    languagePopularity: LanguageStat[];
    avgScoresByDifficulty: Record<string, number>;
    recentCompletedGames: GameHistory[];
    topPerformers: TopPerformer[];
    gamesOverTime: Array<{ date: string; count: number }>;
}

export default function Dashboard({
    stats,
    gameTypeDistribution,
    difficultyDistribution,
    languagePopularity,
    avgScoresByDifficulty,
    recentCompletedGames,
    topPerformers,
}: Props) {
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
            <Head title="Admin Dashboard" />

            <div className="m-4 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of platform statistics and activity
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UsersIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.newUsers} in last 7 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
                            <GamepadIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalGames}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.recentGames} in last 7 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
                            <TrendingUpIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalRounds}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalGames > 0
                                    ? (stats.totalRounds / stats.totalGames).toFixed(1)
                                    : 0}{' '}
                                avg per game
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Games</CardTitle>
                            <ActivityIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeGames}</div>
                            <p className="text-xs text-muted-foreground">Currently in progress</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Game Type Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3Icon className="size-5" />
                                Game Type Distribution
                            </CardTitle>
                            <CardDescription>Breakdown by challenge type</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(gameTypeDistribution).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {type === 'debug' ? 'Debug' : 'Problem Solving'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-muted-foreground">
                                            {((count / stats.totalGames) * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-lg font-bold">{count}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Difficulty Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3Icon className="size-5" />
                                Difficulty Distribution
                            </CardTitle>
                            <CardDescription>Games by difficulty level</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(difficultyDistribution).map(([difficulty, count]) => (
                                <div key={difficulty} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getDifficultyColor(difficulty)}>
                                            {difficulty}
                                        </Badge>
                                        {avgScoresByDifficulty[difficulty] && (
                                            <span className="text-xs text-muted-foreground">
                                                Avg: {avgScoresByDifficulty[difficulty]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-muted-foreground">
                                            {((count / stats.totalGames) * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-lg font-bold">{count}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Language Popularity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CodeIcon className="size-5" />
                                Popular Languages
                            </CardTitle>
                            <CardDescription>Most used programming languages</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {languagePopularity.map((lang, index) => (
                                    <div
                                        key={lang.language}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium capitalize">
                                                {lang.language}
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold">{lang.count}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Performers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrophyIcon className="size-5" />
                                Top Performers
                            </CardTitle>
                            <CardDescription>Users with highest win rates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topPerformers.slice(0, 5).map((user, index) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-yellow-500/10 text-sm font-bold text-yellow-500">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.total_matches} games • {user.wins} wins
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">{user.win_rate}%</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Completed Games */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClockIcon className="size-5" />
                            Recent Completed Games
                        </CardTitle>
                        <CardDescription>Latest finished challenges</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentCompletedGames.map((game) => (
                                <a
                                    key={game.id}
                                    href={`/game/results/${game.id}`}
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CodeIcon className="size-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">
                                                    {game.user.username}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize text-xs"
                                                >
                                                    {game.language}
                                                </Badge>
                                                <Badge
                                                    className={`${getDifficultyColor(game.difficulty)} text-xs`}
                                                >
                                                    {game.difficulty}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    {game.gametype === 'debug'
                                                        ? 'Debug'
                                                        : 'Problem Solving'}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <CalendarIcon className="size-3" />
                                                {formatDate(game.completed_at)}
                                                <span>•</span>
                                                <ClockIcon className="size-3" />
                                                {game.duration} min
                                                <span>•</span>
                                                {game.round} rounds
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xl font-bold">
                                            <TrophyIcon className="size-4 text-yellow-500" />
                                            {game.total_score}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
