import AppLayout from '@/layouts/app-layout';
import { lobby } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    GamepadIcon,
    PlusIcon,
    UsersIcon,
    TrophyIcon,
    ZapIcon,
    CopyIcon,
    LogOutIcon,
    PlayIcon,
    ClockIcon
} from 'lucide-react';
import { useState } from 'react';
import { useInitials } from '@/hooks/use-initials';
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
        title: 'Lobby',
        href: lobby().url,
    },
];

interface LobbyData {
    id: number;
    invite_code: string;
    host_id: number;
    guest_id: number | null;
    status: 'waiting' | 'started';
    host: {
        id: number;
        username: string;
        nickname: string | null;
        profile_path: string | null;
        experience: number;
        wins: number;
    };
    guest: {
        id: number;
        username: string;
        nickname: string | null;
        profile_path: string | null;
        experience: number;
        wins: number;
    } | null;
    created_at: string;
}

interface Props {
    currentLobby?: LobbyData;
}

export default function Lobby({ currentLobby }: Props) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [createDialog, setCreateDialog] = useState(false);
    const [joinDialog, setJoinDialog] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [copied, setCopied] = useState(false);

    const isHost = currentLobby?.host_id === auth.user.id;
    const isGuest = currentLobby?.guest_id === auth.user.id;
    const isInLobby = isHost || isGuest;

    const handleCreateLobby = () => {
        router.post('/lobby/create', {}, {
            onSuccess: () => {
                setCreateDialog(false);
            },
        });
    };

    const handleJoinLobby = () => {
        router.post('/lobby/join', { invite_code: inviteCode }, {
            onSuccess: () => {
                setJoinDialog(false);
                setInviteCode('');
            },
        });
    };

    const handleLeaveLobby = () => {
        router.post('/lobby/leave', {});
    };

    const handleStartGame = () => {
        router.post('/lobby/start', {});
    };

    const copyInviteCode = () => {
        if (currentLobby?.invite_code) {
            navigator.clipboard.writeText(currentLobby.invite_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lobby" />

            <div className="m-4 space-y-6">
                {/* User Stats Banner */}
                <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-purple-500/20">
                    <CardContent >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border border-neutral-700">
                                    <AvatarImage
                                        src={auth.user.profile_path ? `/storage/${auth.user.profile_path}` : undefined}
                                        alt={auth.user.username}
                                        className='object-cover'
                                    />
                                    <AvatarFallback className="text-xl">
                                        {getInitials(auth.user.nickname || auth.user.username)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {auth.user.nickname || auth.user.username}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Ready to compete!
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-2xl font-bold">
                                        <ZapIcon className="size-5 text-yellow-500" />
                                        {auth.user.experience}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Experience</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-2xl font-bold">
                                        <TrophyIcon className="size-5 text-orange-500" />
                                        {auth.user.wins}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Wins</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-2xl font-bold">
                                        <GamepadIcon className="size-5 text-blue-500" />
                                        {auth.user.current_streak}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Streak</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Lobby Area */}
                {isInLobby && currentLobby ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <UsersIcon className="size-5" />
                                        Battle Lobby
                                        <Badge variant={currentLobby.status === 'waiting' ? 'secondary' : 'default'}>
                                            {currentLobby.status === 'waiting' ? 'Waiting for opponent...' : 'Ready to start!'}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Invite Code: <code className="font-mono font-bold text-lg">{currentLobby.invite_code}</code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-2 h-6 w-6"
                                            onClick={copyInviteCode}
                                        >
                                            <CopyIcon className="size-4" />
                                        </Button>
                                        {copied && <span className="text-xs text-green-600 ml-2">✓ Copied!</span>}
                                    </CardDescription>
                                </div>
                                <Button variant="destructive" onClick={handleLeaveLobby}>
                                    <LogOutIcon />
                                    Leave Lobby
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Host */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="default">Host</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={currentLobby.host.profile_path ? `/storage/${currentLobby.host.profile_path}` : undefined}
                                                alt={currentLobby.host.username}
                                            />
                                            <AvatarFallback>
                                                {getInitials(currentLobby.host.nickname || currentLobby.host.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">
                                                {currentLobby.host.nickname || currentLobby.host.username}
                                            </h3>
                                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <ZapIcon className="size-3" /> {currentLobby.host.experience} XP
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrophyIcon className="size-3" /> {currentLobby.host.wins} Wins
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="secondary">Guest</Badge>
                                    </div>
                                    {currentLobby.guest ? (
                                        <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                    src={currentLobby.guest.profile_path ? `/storage/${currentLobby.guest.profile_path}` : undefined}
                                                    alt={currentLobby.guest.username}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(currentLobby.guest.nickname || currentLobby.guest.username)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">
                                                    {currentLobby.guest.nickname || currentLobby.guest.username}
                                                </h3>
                                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <ZapIcon className="size-3" /> {currentLobby.guest.experience} XP
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <TrophyIcon className="size-3" /> {currentLobby.guest.wins} Wins
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-muted-foreground/25 h-full">
                                            <ClockIcon className="size-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-muted-foreground">Waiting for opponent...</p>
                                            <p className="text-xs text-muted-foreground mt-1">Share the invite code above</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Start Game Button - Only visible to host when guest joined */}
                            {isHost && currentLobby.guest && currentLobby.status === 'waiting' && (
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        size="lg"
                                        className="bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                                        onClick={handleStartGame}
                                    >
                                        <PlayIcon />
                                        Start Battle!
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Create Lobby Card */}
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCreateDialog(true)}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <PlusIcon className="size-8 text-primary" />
                                    </div>
                                    Create Lobby
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Host a new battle and invite your friends to compete
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        Generate unique invite code
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        Customize match settings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary" />
                                        Start when ready
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Join Lobby Card */}
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setJoinDialog(true)}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <div className="p-3 rounded-lg bg-secondary/10">
                                        <UsersIcon className="size-8 text-secondary-foreground" />
                                    </div>
                                    Join Lobby
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Enter an invite code to join an existing battle
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-secondary-foreground" />
                                        Get invite code from host
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-secondary-foreground" />
                                        Join instantly
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-secondary-foreground" />
                                        Compete and level up
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Create Lobby Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Lobby</DialogTitle>
                        <DialogDescription>
                            You'll receive a unique invite code to share with your opponent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Click create to generate your battle lobby. You can configure match settings once your opponent joins.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateLobby}>
                            <PlusIcon />
                            Create Lobby
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Join Lobby Dialog */}
            <Dialog open={joinDialog} onOpenChange={setJoinDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join Lobby</DialogTitle>
                        <DialogDescription>
                            Enter the invite code provided by the host.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite_code">Invite Code</Label>
                            <Input
                                id="invite_code"
                                placeholder="Enter 6-character code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="font-mono text-lg"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setJoinDialog(false);
                            setInviteCode('');
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleJoinLobby} disabled={inviteCode.length !== 6}>
                            <UsersIcon />
                            Join Battle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
