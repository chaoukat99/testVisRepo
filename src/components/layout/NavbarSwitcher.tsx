import { Navbar } from "@/components/layout/Navbar";
import { CircularNavbar } from "@/components/layout/CircularNavbar";

interface NavbarSwitcherProps {
    variant?: 'standard' | 'circular';
}

/**
 * NavbarSwitcher - A component that allows switching between different navbar styles
 * 
 * @param variant - The navbar style to use ('standard' or 'circular')
 * 
 * Usage:
 * - For standard navbar: <NavbarSwitcher variant="standard" />
 * - For circular navbar: <NavbarSwitcher variant="circular" />
 * - Default is 'circular'
 */
export function NavbarSwitcher({ variant = 'circular' }: NavbarSwitcherProps) {
    if (variant === 'standard') {
        return <Navbar />;
    }

    return <CircularNavbar />;
}
