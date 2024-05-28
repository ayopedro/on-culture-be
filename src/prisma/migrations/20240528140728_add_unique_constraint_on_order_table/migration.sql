/*
  Warnings:

  - A unique constraint covering the columns `[customerId,productId,date]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_customerId_productId_date_key" ON "orders"("customerId", "productId", "date");
