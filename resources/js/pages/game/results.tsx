import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    TrophyIcon,
    CodeIcon,
    ChevronDownIcon,
    HomeIcon,
    PlayIcon,
    StarIcon,
    TargetIcon,
    ZapIcon,
    ClockIcon
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/lobby' },
    { title: 'Results', href: '/game/results' },
];

interface HistoryData {
    id: number;
    user_id: number;
    total_score: number;
    language: string;
    difficulty: string;
    gametype: string;
    round: number;
    start_time: string;
    end_time: string;
}

interface RoundData {
    id: number;
    round_number: number;
    question: {
        title?: string;
        description?: string;
    };
    type: string;
    initial_code: string;
    score: number;
    user_code: string;
    evaluation: {
        score: number;
        feedback?: {
            correctness?: number;
            quality?: number;
            efficiency?: number;
            improvements?: string[];
            strengths?: string[];
            suggested_solution?: string;
        };
    };
    submitted_at: string;
}

interface PerformanceData {
    rating: string;
    color: string;
    message: string;
}

interface Props {
    history: HistoryData;
    rounds: RoundData[];
    totalPossibleScore: number;
    performance: PerformanceData;
}

export default function Results({ history, rounds, totalPossibleScore, performance }: Props) {
    const [openRounds, setOpenRounds] = useState<number[]>([]);

    const toggleRound = (roundId: number) => {
        setOpenRounds((prev) =>
            prev.includes(roundId)
                ? prev.filter((id) => id !== roundId)
                : [...prev, roundId]
        );
    };

    const percentage = Math.round((history.total_score / totalPossibleScore) * 100);

    const startTime = new Date(history.start_time);
    const endTime = new Date(history.end_time);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes

    const getRatingColor = (color: string) => {
        const colors: Record<string, string> = {
            green: 'text-green-500 border-green-500 bg-green-500/10',
            blue: 'text-blue-500 border-blue-500 bg-blue-500/10',
            yellow: 'text-yellow-500 border-yellow-500 bg-yellow-500/10',
            orange: 'text-orange-500 border-orange-500 bg-orange-500/10',
        };
        return colors[color] || colors.blue;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Game Results" />
            <div className="flex w-full justify-center">
                <div className="m-4 max-w-5xl w-full space-y-6">
                    <Card className={`border-2 ${getRatingColor(performance.color)}`}>
                        <CardContent className="pt-8">
                            <div className="text-center space-y-4">
                                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-2">
                                    <TrophyIcon className="size-16 text-primary" />
                                </div>
                                <h1 className="text-4xl font-black">Game Complete!</h1>
                                <div className="flex items-center justify-center gap-2">
                                    <Badge variant="outline" className={`text-2xl px-6 py-2 ${getRatingColor(performance.color)}`}>
                                        {performance.rating}
                                    </Badge>
                                </div>
                                <p className="text-xl text-muted-foreground">{performance.message}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <StarIcon className="size-8 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Total Score</p>
                                    <p className="text-3xl font-bold">{history.total_score}</p>
                                    <p className="text-xs text-muted-foreground">out of {totalPossibleScore}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <TargetIcon className="size-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                    <p className="text-3xl font-bold">{percentage}%</p>
                                    <p className="text-xs text-muted-foreground">score rate</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <ZapIcon className="size-8 text-purple-500 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Rounds</p>
                                    <p className="text-3xl font-bold">{history.round}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{history.difficulty}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <ClockIcon className="size-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="text-3xl font-bold">{duration}</p>
                                    <p className="text-xs text-muted-foreground">minutes</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CodeIcon className="size-5" />
                                Round by Round Breakdown
                            </CardTitle>
                            <CardDescription>
                                View detailed feedback for each round
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {rounds.map((round) => (
                                <Collapsible
                                    key={round.id}
                                    open={openRounds.includes(round.id)}
                                    onOpenChange={() => toggleRound(round.id)}
                                >
                                    <Card>
                                        <CollapsibleTrigger className="w-full">
                                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline">Round {round.round_number}</Badge>
                                                        <CardTitle className="text-lg">
                                                            {round.question.title || `Challenge ${round.round_number}`}
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge
                                                            variant={round.score >= 85 ? 'default' : round.score >= 70 ? 'secondary' : 'outline'}
                                                        >
                                                            {round.score}/100
                                                        </Badge>
                                                        <ChevronDownIcon
                                                            className={`size-5 transition-transform ${openRounds.includes(round.id) ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <CardContent className="space-y-4 border-t pt-4">
                                                {round.evaluation?.feedback && (
                                                    <div className="space-y-3">
                                                        {typeof round.evaluation.feedback === 'string' ? (
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Feedback:</h4>
                                                                <p className="text-sm text-muted-foreground">{round.evaluation.feedback}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {round.evaluation.feedback.correctness && (
                                                                    <div>
                                                                        <h4 className="font-semibold mb-2 text-blue-600">Correctness:</h4>
                                                                        <p className="text-sm text-muted-foreground">{round.evaluation.feedback.correctness}</p>
                                                                    </div>
                                                                )}
                                                                {round.evaluation.feedback.quality && (
                                                                    <div>
                                                                        <h4 className="font-semibold mb-2 text-purple-600">Code Quality:</h4>
                                                                        <p className="text-sm text-muted-foreground">{round.evaluation.feedback.quality}</p>
                                                                    </div>
                                                                )}
                                                                {round.evaluation.feedback.efficiency && (
                                                                    <div>
                                                                        <h4 className="font-semibold mb-2 text-green-600">Efficiency:</h4>
                                                                        <p className="text-sm text-muted-foreground">{round.evaluation.feedback.efficiency}</p>
                                                                    </div>
                                                                )}
                                                                {round.evaluation.feedback.improvements && round.evaluation.feedback.improvements.length > 0 && (
                                                                    <div>
                                                                        <h4 className="font-semibold mb-2 text-orange-600">Suggestions for Improvement:</h4>
                                                                        <ul className="list-disc list-inside space-y-1">
                                                                            {round.evaluation.feedback.improvements.map((improvement: string, i: number) => (
                                                                                <li key={i} className="text-sm">{improvement}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-semibold mb-2">Your Solution:</h4>
                                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                                        <code>{round.user_code}</code>
                                                    </pre>
                                                </div>
                                                {round.evaluation.feedback?.suggested_solution && (
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-purple-600">💡 Suggested Optimal Solution:</h4>
                                                        <pre className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg overflow-x-auto text-sm border border-purple-200 dark:border-purple-800">
                                                            <code>{round.evaluation.feedback?.suggested_solution}</code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/">
                                <HomeIcon className="mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button size="lg" asChild>
                            <Link href="/game/configure">
                                <PlayIcon className="mr-2" />
                                Play Again
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
