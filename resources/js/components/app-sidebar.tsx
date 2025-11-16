import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Home, Play, History } from 'lucide-react';
import AppLogo from './app-logo';
import userManagement from '@/routes/userManagement';

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = auth.user.role == "admin" ? [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Manajemen Pengguna',
            href: userManagement.index(),
            icon: BookOpen,
        },
    ] : [
        {
            title: 'Dashboard',
            href: '/lobby',
            icon: Home,
        },
        {
            title: 'Mulai Challenge',
            href: '/game/configure',
            icon: Play,
        },
        {
            title: 'Riwayat Game',
            href: '/game/history',
            icon: History,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-linear-to-br  ">
            <SidebarContent className='mt-2'>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
