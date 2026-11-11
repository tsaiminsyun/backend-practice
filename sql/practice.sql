-- ========================================
-- 1. 建立資料表（已完成）
-- ========================================

-- CREATE TABLE practice_todos (
--   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   title TEXT NOT NULL,
--   completed BOOLEAN NOT NULL DEFAULT FALSE
-- );


-- ========================================
-- 2. 新增資料（已完成）
-- ========================================

-- INSERT INTO practice_todos (title, completed)
-- VALUES
--   ('Learn PostgreSQL', TRUE),
--   ('Learn TypeScript', FALSE),
--   ('Learn Docker', FALSE);


-- ========================================
-- 3. 查詢全部資料
-- ========================================

SELECT *
FROM practice_todos;


-- ========================================
-- 4. WHERE：查詢未完成的 Todo
-- ========================================

SELECT *
FROM practice_todos
WHERE completed = FALSE;


-- ========================================
-- 5. ORDER BY：依 ID 由大到小排序
-- ========================================

SELECT *
FROM practice_todos
ORDER BY id DESC;


-- ========================================
-- 6. LIMIT：只取得兩筆
-- ========================================

SELECT *
FROM practice_todos
LIMIT 2;