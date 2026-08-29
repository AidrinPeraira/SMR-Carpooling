import { Request, Response } from "express";

/**
 * Interface for the Admin controller (v1).
 * Defines the contract for all admin-facing HTTP request handlers.
 */
export interface IAdminControllerV1 {
  listTransactions(req: Request, res: Response): Promise<void>;
}
