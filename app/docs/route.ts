import { auth } from "@/lib/auth";
import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = async () => {
  const openAPISchema = await auth.api.generateOpenAPISchema();

  return ApiReference({
    configuration: {
      spec: {
        url: "/api/auth/reference",
        content: openAPISchema, 
      },
      pageTitle: "API Documentation",
      theme: "dark",
    },
  });
};