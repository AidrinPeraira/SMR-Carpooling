"use client";

import { IMapProviderService } from "@/features/map/services/IMapProviderService";
import { createContext } from "react";

export const MapContext = createContext<IMapProviderService | null>(null);
