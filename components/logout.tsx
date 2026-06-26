"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Logout() {
    const [isLoading] = useState(false);
    const router = useRouter();
    const handleLogout = async() => {
        await authClient.signOut();
        router.push("/login")
    };

    return (
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            Logout <LogOut className="size-4" />
        </Button>
    );
}