import AppLayout from '@/layouts/app-layout';
import userManagement from '@/routes/userManagement';
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
        title: 'User Management',
        href: userManagement.index().url,
    },
];

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    nickname: string | null;
    experience: number;
    total_matches: number;
    wins: number;
    current_streak: number;
    created_at: string;
}

interface Props {
    users: User[];
}

export default function UserManagement({ users }: Props) {
    const [search, setSearch] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    });

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.nickname && user.nickname.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDelete = (user: User) => {
        setDeleteDialog({ open: true, user });
    };

    const confirmDelete = () => {
        if (deleteDialog.user) {
            router.delete(userManagement.destroy(deleteDialog.user.id).url, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, user: null });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <Card className='m-4'>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage all users in the system</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={userManagement.create().url}>
                                <PlusIcon />
                                Add User
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by username, email, or nickname..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Nickname</TableHead>
                                <TableHead className="text-right">Experience</TableHead>
                                <TableHead className="text-right">Matches</TableHead>
                                <TableHead className="text-right">Wins</TableHead>
                                <TableHead className="text-right">Streak</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.nickname || '-'}</TableCell>
                                        <TableCell className="text-right">{user.experience}</TableCell>
                                        <TableCell className="text-right">{user.total_matches}</TableCell>
                                        <TableCell className="text-right">{user.wins}</TableCell>
                                        <TableCell className="text-right">{user.current_streak}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={userManagement.edit(user.id).url}>
                                                        <PencilIcon />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(user)}
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

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete user "{deleteDialog.user?.username}"? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })}>
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
