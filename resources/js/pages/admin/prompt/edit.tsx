import AppLayout from '@/layouts/app-layout';
import promptManagement from '@/routes/promptManagement';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface Prompt {
    id: number;
    type: string;
    challenge_prompt: string;
    scoring_prompt: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    prompt: Prompt;
}

export default function EditPrompt({ prompt }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Prompt Management',
            href: promptManagement.index().url,
        },
        {
            title: 'Edit Prompt',
            href: promptManagement.edit(prompt.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Prompt - ${prompt.type}`} />

            <div className=" flex justify-center">
                <Card className='m-4 w-full max-w-4xl'>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={promptManagement.index().url}>
                                    <ArrowLeftIcon />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle>Edit Prompt</CardTitle>
                                <CardDescription>Update challenge and scoring prompt for {prompt.type}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form action={promptManagement.update(prompt.id).url} method="post" className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">
                                            Type <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="type"
                                            name="type"
                                            type="text"
                                            required
                                            autoFocus
                                            defaultValue={prompt.type}
                                            placeholder="e.g., Algorithm, Data Structure, Problem Solving"
                                            aria-invalid={!!errors.type}
                                        />
                                        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="challenge_prompt">
                                            Challenge Prompt <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="challenge_prompt"
                                            name="challenge_prompt"
                                            required
                                            rows={8}
                                            defaultValue={prompt.challenge_prompt}
                                            placeholder="Enter the challenge prompt that will be used to generate coding challenges..."
                                            aria-invalid={!!errors.challenge_prompt}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This prompt will be used to generate the coding challenge for participants.
                                        </p>
                                        {errors.challenge_prompt && (
                                            <p className="text-sm text-destructive">{errors.challenge_prompt}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scoring_prompt">
                                            Scoring Prompt <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="scoring_prompt"
                                            name="scoring_prompt"
                                            required
                                            rows={8}
                                            defaultValue={prompt.scoring_prompt}
                                            placeholder="Enter the scoring prompt that will be used to evaluate submissions..."
                                            aria-invalid={!!errors.scoring_prompt}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This prompt will be used to score and evaluate participant submissions.
                                        </p>
                                        {errors.scoring_prompt && (
                                            <p className="text-sm text-destructive">{errors.scoring_prompt}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Update Prompt
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href={promptManagement.index().url}>Cancel</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
