CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "Category" ("id", "name", "slug")
VALUES
  (uuid_generate_v4(), 'Art', 'art'),
  (uuid_generate_v4(), 'Domain Names', 'domain-names'),
  (uuid_generate_v4(), 'Gaming', 'gaming'),
  (uuid_generate_v4(), 'Memberships', 'memberships'),
  (uuid_generate_v4(), 'Music', 'music'),
  (uuid_generate_v4(), 'PFPs', 'pfps'),
  (uuid_generate_v4(), 'Photography', 'photography'),
  (uuid_generate_v4(), 'Sports', 'sports'),
  (uuid_generate_v4(), 'Virtual Worlds', 'virtual-worlds');
