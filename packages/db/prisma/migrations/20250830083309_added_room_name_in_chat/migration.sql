/*
  Warnings:

  - You are about to drop the column `roomId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "roomId",
ADD COLUMN     "roomName" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "public"."Room"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
