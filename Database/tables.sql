
create table friends
(
    id int
    auto_increment primary key,
     name varchar
    (255), 
     email varchar
    (255), 
     phone char
    (10), 
     relationship varchar
    (255), 
     userID int, 
     FOREIGN KEY
    (userID) REFERENCES users
    (id)
);
create table friends(friends int ,user int);
