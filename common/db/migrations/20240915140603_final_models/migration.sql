-- CreateEnum
CREATE TYPE "APP_STATE" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "picture" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "redirect_uris" TEXT[],
    "origin" TEXT[],
    "allowed_scopes" TEXT[],
    "client_id" TEXT NOT NULL,
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "state" "APP_STATE" NOT NULL DEFAULT 'ACTIVE',
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_screen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "developer_email" TEXT,
    "app_address" TEXT NOT NULL,
    "message" TEXT,
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_app_mapping" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_app_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_secret_key" ON "app"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "app_client_id_key" ON "app"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_owner_id_key" ON "app"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "consent_screen_app_id_key" ON "consent_screen"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_app_mapping_app_id_key" ON "token_app_mapping"("app_id");

-- AddForeignKey
ALTER TABLE "app" ADD CONSTRAINT "app_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_screen" ADD CONSTRAINT "consent_screen_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_app_mapping" ADD CONSTRAINT "token_app_mapping_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "app"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
