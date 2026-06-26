import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { openAPI, organization } from "better-auth/plugins"
import { getActiveOrganization } from "@/server/organizations";
import { ac, owner, admin, member } from "./auth/permissions"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const pool = new Pool({
  connectionString: "postgres://postgres:11223@localhost:5432/better_auth_db",
});

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({ userEmail: user.email, resetUrl: url, username: user.name }),
      })
    },
  },
  
  baseURL: process.env.BETTER_AUTH_URL!,
  socialProviders: {
    google: { 
        clientId: process.env.GOOGLE_CLIENT_ID!, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
    },
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID!, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET!, 
    }, 
    microsoft: { 
      clientId: process.env.MICROSOFT_CLIENT_ID!, 
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      // tenantId: process.env.MICROSOFT_TENANT_ID!,
      tenantId: 'organizations',
      authority: "https://login.microsoftonline.com",
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },
  
  database: pool,
  
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 24 * 7 // 7 day
  },
  
  plugins: [
    nextCookies(),
    openAPI(),
    organization({
        ac,
        roles: {
            owner,
            admin,
            member,
        }
    })
  ]
});