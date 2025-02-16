-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('MANICURE', 'CLIENTE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL DEFAULT 'CLIENTE',
ALTER COLUMN "password" DROP NOT NULL;
