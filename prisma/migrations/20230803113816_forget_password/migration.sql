-- CreateEnum
CREATE TYPE "TokenValidityStatusEnum" AS ENUM ('PENDING', 'VERIFIED');

-- CreateTable
CREATE TABLE "AuthVerificationToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "validityStatus" "TokenValidityStatusEnum" NOT NULL DEFAULT 'PENDING',
    "metaData" JSONB DEFAULT '{}',
    "status" "FieldStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdById" UUID,
    "updatedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "userId" UUID NOT NULL,

    CONSTRAINT "AuthVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthVerificationToken_userId_token_idx" ON "AuthVerificationToken"("userId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "AuthVerificationToken_userId_type_key" ON "AuthVerificationToken"("userId", "type");

-- AddForeignKey
ALTER TABLE "AuthVerificationToken" ADD CONSTRAINT "AuthVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
