create table
  public."Menu" (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    code text null,
    meta jsonb null,
    updated_at timestamp with time zone null default now(),
    name text null,
    path text null,
    "order" integer null default 0,
    parent_id bigint null default '0'::bigint,
    constraint Menu_pkey primary key (id)
  ) tablespace pg_default;


  create table
  public."Page" (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    meta jsonb null,
    constraint Page_pkey primary key (id)
  ) tablespace pg_default;