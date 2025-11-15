import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    CodeIcon,
    WrenchIcon,
    PlayIcon,
    SettingsIcon,
    SparklesIcon
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/lobby' },
    { title: 'Configure Game', href: '/game/configure' },
];

interface Language {
    value: string;
    label: string;
}

interface GameType {
    value: string;
    label: string;
    description: string;
}

interface Props {
    languages: Language[];
    difficulties: string[];
    gameTypes: GameType[];
}

export default function Configure({ languages, difficulties, gameTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        language: 'python',
        difficulty: 'medium',
        round_count: 3,
        game_type: 'problem-solving',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/game/start');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configure Game" />

            <div className="flex w-full justify-center">
                <div className="m-4 max-w-3xl w-full space-y-6">
                    {/* Welcome Card */}
                    <Card className="bg-linear-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 rounded-full bg-primary/10">
                                    <SparklesIcon className="size-12 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl">Start Your Coding Challenge</CardTitle>
                            <CardDescription className="text-base">
                                Test your skills with AI-generated coding challenges
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Configuration Form */}
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <SettingsIcon className="size-5" />
                                    Game Configuration
                                </CardTitle>
                                <CardDescription>
                                    Choose your preferred language, difficulty, and challenge type
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Programming Language */}
                                <div className="flex gap-3 flex-col">
                                    <Label htmlFor="language">Programming Language</Label>
                                    <Select
                                        value={data.language}
                                        onValueChange={(value) => setData('language', value)}
                                    >
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.language && (
                                        <p className="text-sm text-destructive">{errors.language}</p>
                                    )}
                                </div>

                                {/* Difficulty */}
                                <div className="flex gap-3 flex-col">
                                    <Label htmlFor="difficulty">Difficulty Level</Label>
                                    <Select
                                        value={data.difficulty}
                                        onValueChange={(value) => setData('difficulty', value)}
                                    >
                                        <SelectTrigger id="difficulty">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {difficulties.map((diff) => (
                                                <SelectItem key={diff} value={diff}>
                                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.difficulty && (
                                        <p className="text-sm text-destructive">{errors.difficulty}</p>
                                    )}
                                </div>

                                {/* Number of Rounds */}
                                <div className="flex gap-3 flex-col">
                                    <Label htmlFor="rounds">Number of Rounds</Label>
                                    <Select
                                        value={data.round_count.toString()}
                                        onValueChange={(value) => setData('round_count', parseInt(value))}
                                    >
                                        <SelectTrigger id="rounds">
                                            <SelectValue placeholder="Select rounds" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 3, 5, 7].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} {num === 1 ? 'Round' : 'Rounds'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.round_count && (
                                        <p className="text-sm text-destructive">{errors.round_count}</p>
                                    )}
                                </div>

                                {/* Game Type */}
                                <div className="flex gap-3 flex-col">
                                    <Label>Challenge Type</Label>
                                    <RadioGroup
                                        value={data.game_type}
                                        onValueChange={(value: string) => setData('game_type', value)}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        {gameTypes.map((type) => (
                                            <div key={type.value}>
                                                <RadioGroupItem
                                                    value={type.value}
                                                    id={type.value}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={type.value}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                                >
                                                    {type.value === 'debug' ? (
                                                        <WrenchIcon className="mb-3 size-8" />
                                                    ) : (
                                                        <CodeIcon className="mb-3 size-8" />
                                                    )}
                                                    <div className="text-center">
                                                        <div className="font-semibold">{type.label}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.game_type && (
                                        <p className="text-sm text-destructive">{errors.game_type}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Start Game Button */}
                        <div className="mt-6 flex justify-center">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold px-12"
                            >
                                <PlayIcon className="mr-2" />
                                {processing ? 'Starting...' : 'Start Challenge!'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
