import AppLayout from '@/layouts/app-layout';
import promptManagement from '@/routes/promptManagement';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Prompt Management',
        href: promptManagement.index().url,
    },
];

interface Prompt {
    id: number;
    type: string;
    challenge_prompt: string;
    scoring_prompt: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    prompts: Prompt[];
}

export default function PromptManagement({ prompts }: Props) {
    const [search, setSearch] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; prompt: Prompt | null }>({
        open: false,
        prompt: null,
    });

    const filteredPrompts = prompts.filter(
        (prompt) =>
            prompt.type.toLowerCase().includes(search.toLowerCase()) ||
            prompt.challenge_prompt.toLowerCase().includes(search.toLowerCase()) ||
            prompt.scoring_prompt.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (prompt: Prompt) => {
        setDeleteDialog({ open: true, prompt });
    };

    const confirmDelete = () => {
        if (deleteDialog.prompt) {
            router.delete(promptManagement.destroy(deleteDialog.prompt.id).url, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, prompt: null });
                },
            });
        }
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prompt Management" />

            <Card className='m-4'>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Prompts</CardTitle>
                            <CardDescription>Manage challenge and scoring prompts</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={promptManagement.create().url}>
                                <PlusIcon />
                                Add Prompt
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by type or prompt content..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Challenge Prompt</TableHead>
                                <TableHead>Scoring Prompt</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPrompts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No prompts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrompts.map((prompt) => (
                                    <TableRow key={prompt.id}>
                                        <TableCell className="font-medium">
                                            <Badge variant="secondary">{prompt.type}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <div className="text-sm" title={prompt.challenge_prompt}>
                                                {truncateText(prompt.challenge_prompt)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <div className="text-sm" title={prompt.scoring_prompt}>
                                                {truncateText(prompt.scoring_prompt)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={promptManagement.edit(prompt.id).url}>
                                                        <PencilIcon />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(prompt)}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, prompt: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Prompt</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this prompt of type "{deleteDialog.prompt?.type}"? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, prompt: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
