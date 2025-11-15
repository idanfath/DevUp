import { cn } from "@/lib/utils";

export default function AppLogo({
    theme = 'dark',
}: {
    theme?: 'light' | 'dark';
}) {
    const color = {
        light: 'text-white',
        dark: 'text-gray-900',
    };
    return (
        <>
            <div className=" grid flex-1 text-left text-sm select-none" >
                <span className={cn("truncate text-3xl leading-tight font-black tracking-tight ", color[theme])}>
                    Dev<span className="text-yellow-500 dark:text-yellow-400">Up</span>
                </span>
            </div>
        </>
    );
}
