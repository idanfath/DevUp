import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Editor from '@monaco-editor/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    CodeIcon,
    ClockIcon,
    TrophyIcon,
    SendIcon,
    CheckCircleIcon,
    TargetIcon,
    XCircleIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/lobby' },
    { title: 'Game Arena', href: '/game/play' },
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
    end_time: string | null;
}

interface RoundData {
    id: number;
    round_number: number;
    question: {
        title?: string;
        description?: string;
        buggy_code?: string;
        starter_code?: string;
        examples?: Array<{ input: string; output: string }>;
        hints?: string[];
    };
    type: string;
    initial_code: string;
    score: number;
    submitted: boolean;
}

interface Props {
    history: HistoryData;
    currentRound: RoundData;
    roundCount: number;
    language: string;
    difficulty: string;
    gameType: string;
}

export default function Arena({ history, currentRound, roundCount, language, difficulty, gameType }: Props) {
    const [code, setCode] = useState(currentRound?.initial_code || '');
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<any>(null);
    const [roundComplete, setRoundComplete] = useState(currentRound?.submitted || false);

    // Update when round changes
    useEffect(() => {
        if (currentRound) {
            setCode(currentRound.initial_code || '');
            setRoundComplete(currentRound.submitted);
            setFeedback(null);
        }
    }, [currentRound?.id]);

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert('Please write some code before submitting!');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/game/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Server error:', errorData);
                alert(errorData?.error || `Server error: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (result.success) {
                setFeedback(result.evaluation);
                setRoundComplete(true);

                if (result.gameComplete) {
                    setTimeout(() => {
                        router.visit('/game/results');
                    }, 3000);
                } else {
                    setTimeout(() => {
                        router.reload();
                    }, 3000);
                }
            } else {
                alert(result.error || 'Failed to submit code.');
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTerminate = () => {
        if (confirm('Are you sure you want to terminate this game? You will not receive any XP.')) {
            router.post('/game/terminate');
        }
    };

    const question = currentRound?.question;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Round ${currentRound?.round_number} - Game Arena`} />

            <div className="m-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent >
                            <div className="flex items-center gap-2">
                                <TargetIcon className="size-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Round</p>
                                    <p className="text-2xl font-bold">{currentRound?.round_number} / {roundCount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent >
                            <div className="flex items-center gap-2">
                                <TrophyIcon className="size-5 text-yellow-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="text-2xl font-bold">{history.total_score}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent >
                            <div className="flex items-center gap-2">
                                <CodeIcon className="size-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Language</p>
                                    <p className="text-2xl font-bold capitalize">{language}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <CodeIcon className="size-5" />
                                    Challenge
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Badge variant="secondary">{gameType === 'debug' ? 'Debug' : 'Problem Solving'}</Badge>
                                    <Badge variant="outline" className="capitalize">{difficulty}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                            {question?.title && (
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{question.title}</h3>
                                </div>
                            )}

                            {question?.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{question.description}</p>
                                </div>
                            )}

                            {question?.examples && question.examples.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Examples:</h4>
                                    {question.examples.map((ex, i) => (
                                        <div key={i} className="bg-muted p-3 rounded-md mb-2">
                                            <p className="text-sm">
                                                <strong>Input:</strong>{' '}
                                                {typeof ex.input === 'object'
                                                    ? JSON.stringify(ex.input, null, 2)
                                                    : ex.input}
                                            </p>
                                            <p className="text-sm">
                                                <strong>Output:</strong>{' '}
                                                {typeof ex.output === 'object'
                                                    ? JSON.stringify(ex.output, null, 2)
                                                    : ex.output}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question?.hints && question.hints.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Hints:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {question.hints.map((hint, i) => (
                                            <li key={i} className="text-sm text-muted-foreground">{hint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CodeIcon className="size-5" />
                                Your Solution
                            </CardTitle>
                            <CardDescription>
                                Write your code below and submit when ready
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border rounded-md overflow-hidden">
                                <Editor
                                    height="500px"
                                    language={language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : language}
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    theme="light"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        readOnly: roundComplete,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 4,
                                        wordWrap: 'on',
                                    }}
                                />
                            </div>

                            {feedback && (
                                <Alert className="border-green-500 bg-green-500/10">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p className="font-semibold">Score: {feedback.score}/100</p>
                                            {typeof feedback.feedback === 'string' ? (
                                                <p className="text-sm">{feedback.feedback}</p>
                                            ) : feedback.feedback && typeof feedback.feedback === 'object' ? (
                                                <div className="space-y-2 text-sm">
                                                    {feedback.feedback.correctness && (
                                                        <div>
                                                            <strong>Correctness:</strong> {feedback.feedback.correctness}
                                                        </div>
                                                    )}
                                                    {feedback.feedback.quality && (
                                                        <div>
                                                            <strong>Quality:</strong> {feedback.feedback.quality}
                                                        </div>
                                                    )}
                                                    {feedback.feedback.efficiency && (
                                                        <div>
                                                            <strong>Efficiency:</strong> {feedback.feedback.efficiency}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm">Great work!</p>
                                            )}
                                            {feedback.feedback?.improvements && feedback.feedback.improvements.length > 0 && (
                                                <div className="text-sm">
                                                    <strong>Improvements:</strong>
                                                    <ul className="list-disc list-inside">
                                                        {feedback.feedback.improvements.map((imp: string, i: number) => (
                                                            <li key={i}>{imp}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting || roundComplete}
                                    className="w-full"
                                    size="lg"
                                >
                                    {submitting ? (
                                        'Submitting...'
                                    ) : roundComplete ? (
                                        <>
                                            <CheckCircleIcon className="mr-2" />
                                            Round Complete!
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon className="mr-2" />
                                            Submit Solution
                                        </>
                                    )}
                                </Button>

                                {!roundComplete && (
                                    <Button
                                        onClick={handleTerminate}
                                        variant="destructive"
                                        className="w-full"
                                        size="sm"
                                    >
                                        <XCircleIcon className="mr-2 size-4" />
                                        Terminate Game (No XP)
                                    </Button>
                                )}
                            </div>

                            {roundComplete && (
                                <p className="text-center text-sm text-muted-foreground">
                                    {currentRound.round_number < roundCount
                                        ? 'Loading next round...'
                                        : 'Redirecting to results...'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
