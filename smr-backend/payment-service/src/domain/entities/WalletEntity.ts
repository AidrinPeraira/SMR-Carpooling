export interface WalletEntity {
  id?: string;
  walletId: string;
  customerId: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
