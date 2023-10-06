import { createTRPCReact } from "@trpc/react-query";

import { type AppRouterType } from "../server";

export const trpc = createTRPCReact<AppRouterType>({});