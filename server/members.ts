"use server";

import { auth } from "@/lib/auth";
import { pool } from "@/lib/auth";
import { isAdmin } from "./permissions";

export const addMember = async (
    organizationId: string,
    userId: string,
    role: "admin" | "member"
  ) => {
    try {
      await auth.api.addMember({
        body: {
          userId,
          organizationId,
          role,
        },
      });
    } catch (error) {
      console.error("Error adding member:", error);
      throw new Error("Failed to add member.");
    }
  };
  
  export const removeMember = async (memberId: string) => {
    const admin = await isAdmin();
  
    if (!admin) {
      return {
        success: false,
        error: "You are not authorized to remove members.",
      };
    }
  
    try {
      const query = `DELETE FROM "member" WHERE id = $1`;
      
      await pool.query(query, [memberId]);
  
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("Error removing member:", error);
      return {
        success: false,
        error: "Failed to remove member.",
      };
    }
  };