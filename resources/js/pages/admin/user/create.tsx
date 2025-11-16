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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: userManagement.index().url,
    },
    {
        title: 'Buat Pengguna',
        href: userManagement.create().url,
    },
];

export default function CreateUser() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengguna" />

            <div className=" flex justify-center items-center h-full">
                <Card className='m-4 w-full max-w-4xl'>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={userManagement.index().url}>
                                    <ArrowLeftIcon />
                                </Link>
                            </Button>
                            <div>
                                <CardTitle>Buat Pengguna Baru</CardTitle>
                                <CardDescription>Tambahkan pengguna baru ke sistem</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...userManagement.store.form()} className="space-y-6">
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
                                            placeholder="Masukkan alamat email"
                                            aria-invalid={!!errors.email}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Masukkan password"
                                            aria-invalid={!!errors.password}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi Password <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            placeholder="Konfirmasi password"
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
                                        <Select name="role" defaultValue="user" required>
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
                                            placeholder="Masukkan bio (opsional)"
                                            aria-invalid={!!errors.bio}
                                        />
                                        {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                                    </div>

                                    <div className="flex items-center gap-2 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Buat Pengguna
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
