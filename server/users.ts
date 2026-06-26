"use server";

import { auth } from "lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/lib/auth";
import { User } from "@/components/types/auth";

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/login")
    }

    const res = await pool.query(
        'SELECT * FROM "user" WHERE id = $1 LIMIT 1',
        [session.user.id]
    )

    const currentUser = res.rows[0]

    if (!currentUser) {
        redirect("/login")
    }

    return {
        ...session,
        currentUser
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        })
        return {
            success: true,
            message: "Sigined in successfully."
        };
    } catch (error) {
        const e = error as Error;
        return {
            success: false,
            message: e.message || "An unknown error occurred."
        }
    }
};

export const signUp = async (email: string, password: string, username: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: username
            },
        })
        return {
            success: true,
            message: "Signed up successfully."
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "An unknown error occurred"
        }
    }
};

export const getUsers = async (organizationId: string): Promise<User[]> => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u."emailVerified",
                u.image, 
                u."createdAt", 
                u."updatedAt"
            FROM "user" u
            WHERE NOT EXISTS (
                SELECT 1 
                FROM "member" m 
                WHERE m."userId" = u.id 
                AND m."organizationId" = $1
            )
            ORDER BY u.name ASC
        `;

        const res = await pool.query(query, [organizationId]);

        return res.rows as User[];
    } catch (error) {
        console.error("Error fetching non-member users:", error);
        return [];
    }
};