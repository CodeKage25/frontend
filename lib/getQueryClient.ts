import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { queryClientOptions } from "./utils";

const getQueryClient = cache(() => new QueryClient(queryClientOptions));
export default getQueryClient;