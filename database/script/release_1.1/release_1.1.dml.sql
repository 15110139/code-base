CREATE TABLE users (
    id serial primary key,
    email varchar(100),
    password varchar(1000),
    user_type varchar(100),
    create_at timestamptz
);

CREATE TABLE posts (
    id serial primary key,
    post_id varchar(64),
    likes int8,
    comments int8,
    shares int8,
    description varchar(1000),
    call_to_action_url varchar(10000),
    image_url varchar(1000),
    create_at timestamptz,
    facebook_account_id int4,
    have_seen_at timestamptz,
    description_url varchar(1000),
    is_image bool,
    is_video bool,
    is_activated bool,
    genre_id int4,
    interaction int8,
    page_name varchar(1000),
    page_picture varchar(1000),
    page_id varchar(1000),
    last_seen_at timestamptz,
    country varchar(100),
    ecom_platform_id int4,
    product_class varchar(100)
)