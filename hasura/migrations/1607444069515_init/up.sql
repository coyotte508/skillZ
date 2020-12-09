CREATE TABLE "public"."User"("email" text NOT NULL, "agencyId" uuid NOT NULL, PRIMARY KEY ("email") );

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."Skill"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") );

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."Topic"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") );

ALTER TABLE "public"."Skill" ADD COLUMN "topicId" uuid NOT NULL;

alter table "public"."Skill"
           add constraint "Skill_topicId_fkey"
           foreign key ("topicId")
           references "public"."Topic"
           ("id") on update restrict on delete restrict;

CREATE TABLE "public"."UserSkill"("userEmail" text NOT NULL, "skillId" UUID NOT NULL, PRIMARY KEY ("userEmail","skillId") , FOREIGN KEY ("userEmail") REFERENCES "public"."User"("email") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON UPDATE restrict ON DELETE restrict);

ALTER TABLE "public"."UserSkill" ADD COLUMN "level" integer NOT NULL DEFAULT 1;

ALTER TABLE "public"."UserSkill" ADD COLUMN "created_at" date NOT NULL DEFAULT now();

alter table "public"."UserSkill" drop constraint "UserSkill_pkey";
alter table "public"."UserSkill"
    add constraint "UserSkill_pkey" 
    primary key ( "userEmail", "skillId", "created_at" );

alter table "public"."UserSkill" add constraint "UserSkill_level_between_1_and_5" check (level >= 1 AND level <= 5);

CREATE TABLE "public"."TechnicalAppetite"("userEmail" text NOT NULL, "skillId" uuid NOT NULL, "created_at" date NOT NULL DEFAULT now(), "level" integer NOT NULL DEFAULT 1, PRIMARY KEY ("userEmail","skillId","created_at") , FOREIGN KEY ("userEmail") REFERENCES "public"."User"("email") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON UPDATE restrict ON DELETE restrict, CONSTRAINT "TechnicalAppetite_level_between_1_and_5" CHECK (level >= 1 AND level <= 5));

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."Agency"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") );

alter table "public"."User"
           add constraint "User_agencyId_fkey"
           foreign key ("agencyId")
           references "public"."Agency"
           ("id") on update restrict on delete restrict;
