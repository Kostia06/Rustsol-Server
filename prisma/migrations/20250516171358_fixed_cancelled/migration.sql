/*
  Warnings:

  - Made the column `cancelReason` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "cancelReason" SET NOT NULL,
ALTER COLUMN "cancelReason" SET DEFAULT '';
