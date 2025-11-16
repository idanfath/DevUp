import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ClockIcon,
    CodeIcon,
    CalendarIcon,
    TrophyIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/lobby' },
    { title: 'Riwayat Game', href: '/game/history' },
];

interface Game {
    id: number;
    total_score: number;
    language: string;
    difficulty: string;
    gametype: string;
    round: number;
    start_time: string;
    end_time: string;
    duration: number;
    avg_score: number;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    games: Game[];
    pagination: Pagination;
}

export default function History({ games, pagination }: Props) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
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
            <Head title="Riwayat Game" />

            <div className="flex w-full justify-center">
                <div className="m-4 max-w-5xl w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Riwayat Game</CardTitle>
                                    <CardDescription>Lihat semua challenge yang telah diselesaikan</CardDescription>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href="/lobby">
                                        Kembali ke Dashboard
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {games.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Belum ada game yang diselesaikan</p>
                                    <Button asChild>
                                        <Link href="/game/configure">Mulai Challenge Pertama</Link>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {games.map((game) => (
                                            <Link
                                                key={game.id}
                                                href={`/game/results/${game.id}`}
                                                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors border cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="p-3 rounded-lg bg-primary/10">
                                                        <CodeIcon className="size-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="capitalize">
                                                                {game.language}
                                                            </Badge>
                                                            <Badge className={getDifficultyColor(game.difficulty)}>
                                                                {game.difficulty}
                                                            </Badge>
                                                            <Badge variant="secondary">
                                                                {game.gametype === 'debug' ? 'Debug' : 'Problem Solving'}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {game.round} Ronde
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarIcon className="size-3" />
                                                                {formatDate(game.start_time)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <ClockIcon className="size-3" />
                                                                {game.duration} min
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <div className="flex items-center gap-2 text-2xl font-bold">
                                                        <TrophyIcon className="size-5 text-yellow-500" />
                                                        {game.total_score}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Avg: {game.avg_score}/round
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.last_page > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                Menampilkan {(pagination.current_page - 1) * pagination.per_page + 1} sampai{' '}
                                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari{' '}
                                                {pagination.total} game
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pagination.current_page === 1}
                                                    asChild={pagination.current_page > 1}
                                                >
                                                    {pagination.current_page > 1 ? (
                                                        <Link href={`/game/history?page=${pagination.current_page - 1}`}>
                                                            <ChevronLeftIcon className="size-4 mr-1" />
                                                            Previous
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            <ChevronLeftIcon className="size-4 mr-1" />
                                                            Previous
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={pagination.current_page === pagination.last_page}
                                                    asChild={pagination.current_page < pagination.last_page}
                                                >
                                                    {pagination.current_page < pagination.last_page ? (
                                                        <Link href={`/game/history?page=${pagination.current_page + 1}`}>
                                                            Next
                                                            <ChevronRightIcon className="size-4 ml-1" />
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            Next
                                                            <ChevronRightIcon className="size-4 ml-1" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
