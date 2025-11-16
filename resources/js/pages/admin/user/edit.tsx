import AppLayout from '@/layouts/app-layout';
import userManagement from '@/routes/userManagement';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    nickname: string | null;
    bio: string | null;
    experience: number;
    total_matches: number;
    wins: number;
    current_streak: number;
}

interface Props {
    user: User;
}

export default function EditUser({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manajemen Pengguna',
            href: userManagement.index().url,
        },
        {
            title: 'Edit Pengguna',
            href: userManagement.edit(user.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pengguna - ${user.username}`} />

            <div className=" flex justify-center">
                <Card className='m-4 w-full max-w-4xl'>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={userManagement.index().url}>
                                    <ArrowLeftIcon />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle>Edit Pengguna</CardTitle>
                                <CardDescription>Perbarui informasi pengguna untuk {user.username}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...userManagement.update.form(user.id)} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">
                                            Username <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            autoFocus
                                            defaultValue={user.username}
                                            placeholder="Masukkan username"
                                            aria-invalid={!!errors.username}
                                        />
                                        {errors.username && (
                                            <p className="text-sm text-destructive">{errors.username}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={user.email}
                                            placeholder="Masukkan alamat email"
                                            aria-invalid={!!errors.email}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Biarkan kosong untuk tetap gunakan password saat ini"
                                            aria-invalid={!!errors.password}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Isi hanya jika ingin mengubah password
                                        </p>
                                        {errors.password && (
                                            <p className="text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Konfirmasi password baru"
                                            aria-invalid={!!errors.password_confirmation}
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">
                                            Role <span className="text-destructive">*</span>
                                        </Label>
                                        <Select name="role" defaultValue={user.role} required>
                                            <SelectTrigger id="role" aria-invalid={!!errors.role}>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nickname">Nickname</Label>
                                        <Input
                                            id="nickname"
                                            name="nickname"
                                            type="text"
                                            defaultValue={user.nickname || ''}
                                            placeholder="Masukkan nickname (opsional)"
                                            aria-invalid={!!errors.nickname}
                                        />
                                        {errors.nickname && (
                                            <p className="text-sm text-destructive">{errors.nickname}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input
                                            id="bio"
                                            name="bio"
                                            type="text"
                                            defaultValue={user.bio || ''}
                                            placeholder="Masukkan bio (opsional)"
                                            aria-invalid={!!errors.bio}
                                        />
                                        {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="experience">Experience</Label>
                                            <Input
                                                id="experience"
                                                name="experience"
                                                type="number"
                                                min="0"
                                                defaultValue={user.experience}
                                                aria-invalid={!!errors.experience}
                                            />
                                            {errors.experience && (
                                                <p className="text-sm text-destructive">{errors.experience}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="total_matches">Total Pertandingan</Label>
                                            <Input
                                                id="total_matches"
                                                name="total_matches"
                                                type="number"
                                                min="0"
                                                defaultValue={user.total_matches}
                                                aria-invalid={!!errors.total_matches}
                                            />
                                            {errors.total_matches && (
                                                <p className="text-sm text-destructive">{errors.total_matches}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="wins">Wins</Label>
                                            <Input
                                                id="wins"
                                                name="wins"
                                                type="number"
                                                min="0"
                                                defaultValue={user.wins}
                                                aria-invalid={!!errors.wins}
                                            />
                                            {errors.wins && <p className="text-sm text-destructive">{errors.wins}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="current_streak">Streak Saat Ini</Label>
                                            <Input
                                                id="current_streak"
                                                name="current_streak"
                                                type="number"
                                                min="0"
                                                defaultValue={user.current_streak}
                                                aria-invalid={!!errors.current_streak}
                                            />
                                            {errors.current_streak && (
                                                <p className="text-sm text-destructive">{errors.current_streak}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Perbarui Pengguna
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href={userManagement.index().url}>Batal</Link>
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
