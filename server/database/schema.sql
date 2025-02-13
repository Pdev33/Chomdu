create table user (
  id int unsigned primary key auto_increment not null,
  username varchar(255) not null unique,
  email varchar(255) not null unique,
  password varchar(255) not null,
  amount varchar(255) not null
);

create table expense (
  id int unsigned primary key auto_increment not null,
  amount varchar(255) not null,
  description varchar(255) not null,
  category varchar(255) not null,
  date varchar(255) not null,
  user_id int unsigned not null,
  foreign key (user_id) references user(id)
);

insert into user (username, email, password, amount) values ('Pierre', 'test@gmail.com', 'test', '1000');