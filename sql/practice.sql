CREATE TABLE practice_todos (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO practice_todos (title)
VALUES ('Learn PostgreSQL');

SELECT * FROM practice_todos;