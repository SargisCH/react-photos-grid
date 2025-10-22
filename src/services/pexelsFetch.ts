import createFetchWrapper from "../lib/fetchWrapper";
import { getEnv } from "./configService";

const env = getEnv();
const pexelsApiKey = env.pexelsApiKey;
const pexelsBaseUrl = env.pexelsBaseUrl;

export const pexelsFetch = createFetchWrapper(pexelsBaseUrl, pexelsApiKey);
