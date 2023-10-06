import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server";
import { createContext } from "../../../server/context";

const handler = (req: Request, res: Response) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
    });

export { handler as GET, handler as POST };