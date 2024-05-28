/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_code` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "orders_orderNumber_key";

-- DropIndex
DROP INDEX "products_product_code_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orderNumber",
ADD COLUMN     "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "number" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_code",
ADD COLUMN     "code" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_number_key" ON "orders"("number");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");
