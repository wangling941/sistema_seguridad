-- AlterTable
ALTER TABLE "AccessLog" ADD COLUMN     "visitor_id" INTEGER;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
