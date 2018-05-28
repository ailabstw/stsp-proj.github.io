create table ai_databases (
    id int not null auto_increment primary key,
    db_id varchar(255) not null,
    password varchar(255) not null,
    name varchar(255) not null,
    classify varchar(255) not null,
    `group` varchar(255) not null,
    data_classify varchar(255) not null,
    data_comment varchar(255) not null,
    index_keyword varchar(255) not null,
    data_type varchar(255) not null,
    path varchar(255) not null,
    api_path varchar(255) not null,
    apidoc_path varchar(255) not null,
    website varchar(255) not null,
    date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);