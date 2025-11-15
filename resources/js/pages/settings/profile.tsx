import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { useInitials } from '@/hooks/use-initials';
import { Upload, X, Camera } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        auth.user.profile_path ? `/storage/${auth.user.profile_path}` : null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [removeProfilePicture, setRemoveProfilePicture] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setRemoveProfilePicture(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        setRemoveProfilePicture(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your profile picture, username, and other details"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Profile Picture Section */}
                                <div className="space-y-3">
                                    <Label>Profile Picture</Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage
                                                src={previewUrl || (auth.user.profile_path ? `/storage/${auth.user.profile_path}` : undefined)}
                                                alt={auth.user.username}
                                                className='object-cover'
                                            />
                                            <AvatarFallback className="text-2xl bg-neutral-200 dark:bg-neutral-700">
                                                {getInitials(auth.user.nickname || auth.user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                name="profile_picture"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={processing}
                                            >
                                                <Camera className="mr-2" />
                                                {previewUrl ? 'Change Photo' : 'Upload Photo'}
                                            </Button>
                                            {previewUrl && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleRemovePhoto}
                                                    disabled={processing}
                                                >
                                                    <X className="mr-2" />
                                                    Remove Photo
                                                </Button>
                                            )}
                                            <input
                                                type="hidden"
                                                name="remove_profile_picture"
                                                value={removeProfilePicture ? '1' : '0'}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                    {errors.profile_picture && (
                                        <p className="text-sm text-destructive">{errors.profile_picture}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="username"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.username}
                                        name="username"
                                        required
                                        autoComplete="username"
                                        placeholder="Username"
                                        aria-invalid={!!errors.username}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-destructive">{errors.username}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.nickname || ''}
                                        name="nickname"
                                        autoComplete="nickname"
                                        placeholder="Your display name"
                                        aria-invalid={!!errors.nickname}
                                    />
                                    {errors.nickname && (
                                        <p className="text-sm text-destructive">{errors.nickname}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="email"
                                        placeholder="Email address"
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.bio ?? ''}
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        aria-invalid={!!errors.bio}
                                    />
                                    {errors.bio && (
                                        <p className="text-sm text-destructive">{errors.bio}</p>
                                    )}
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        A new verification link has
                                                        been sent to your email
                                                        address.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                {status === 'profile-updated' && (
                                    <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                            ✨ Profile updated successfully!
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="bg-linear-to-r cursor-pointer from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl"
                                    >
                                        💾 Save Changes
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                            ✨ Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
