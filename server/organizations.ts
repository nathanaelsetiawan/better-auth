"use server";

import { getCurrentUser } from "./users";
import { pool } from "@/lib/auth";
import { MemberWithUser, Organization, OrganizationWithMembers } from "@/components/types/auth";

export async function getOrganizations() {
    const { currentUser } = await getCurrentUser();

    const members = await pool.query(
        'SELECT "organizationId" FROM "member" WHERE "userId" = $1',
        [currentUser.id]
    );

    const memberId = members.rows.map((m) => m.organizationId);

    if (memberId.length === 0) {
        return [];
    }

    const organizations = await pool.query(
        'SELECT * FROM "organization" WHERE "id" = ANY($1)',
        [memberId]
    );

    return organizations.rows;
}

export async function getActiveOrganization(userId: string): Promise<Organization | null> {
    const query = `
            SELECT o.* FROM "organization" o
            JOIN "member" m ON o.id = m."organizationId"
            WHERE m."userId" = $1
            LIMIT 1
        `;

        const res = await pool.query(query, [userId]);

        if (res.rows.length === 0) {
            return null;
        }

        return res.rows[0] as Organization;
}

export async function getOrganizationBySlug(slug: string): Promise<OrganizationWithMembers | null> {
    try {
        const query = `
            SELECT 
                o.*,
                m.id as member_id,
                m.role as member_role,
                m."userId" as member_userId,
                m."organizationId" as member_orgId,   
                m."createdAt" as member_createdAt,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email,
                u.image as user_image
            FROM "organization" o
            LEFT JOIN "member" m ON o.id = m."organizationId"
            LEFT JOIN "user" u ON m."userId" = u.id
            WHERE o.slug = $1
        `;

        const res = await pool.query(query, [slug]);

        if (res.rows.length === 0) return null;

        const firstRow = res.rows[0];
        const organization: OrganizationWithMembers = {
            id: firstRow.id,
            name: firstRow.name,
            slug: firstRow.slug,
            logo: firstRow.logo,
            createdAt: firstRow.createdAt,
            metadata: firstRow.metadata,
            members: []
        };

        res.rows.forEach(row => {
            if (row.member_id) {
                organization.members.push({
                    id: row.member_id,
                    role: row.member_role,
                    userId: row.member_userId,
                    organizationId: row.member_orgId,
                    createdAt: row.member_createdAt,
                    user: {
                        id: row.user_id,
                        name: row.user_name,
                        email: row.user_email,
                        image: row.user_image
                    }
                });
            }
        });

        return organization;
    } catch (error) {
        console.error("Error fetching organization by slug:", error);
        return null;
    }
}