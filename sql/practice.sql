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

-- 7. Transaction - ROLLBACK

BEGIN;

INSERT INTO practice_todos (title, completed)
VALUES ('Transaction rollback demo', FALSE);

ROLLBACK;

-- 8. Check ROLLBACK result

SELECT *
FROM practice_todos
WHERE title = 'Transaction rollback demo';

-- 9. Transaction - COMMIT

BEGIN;

INSERT INTO practice_todos (title, completed)
VALUES ('Transaction commit demo', TRUE);

COMMIT;

-- 10. Check COMMIT result

SELECT *
FROM practice_todos
WHERE title = 'Transaction commit demo';

-- 13. 訂單與庫存練習

CREATE TABLE IF NOT EXISTS practice_products (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  stock INTEGER NOT NULL CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS practice_orders (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES practice_products(id)
);

INSERT INTO practice_products (name, stock)
VALUES ('Notebook', 2)
ON CONFLICT (name) DO NOTHING;

-- 14. 購買一件商品

BEGIN;

WITH deducted AS (
  UPDATE practice_products
  SET stock = stock - 1
  WHERE name = 'Notebook' AND stock > 0
  RETURNING id
)
INSERT INTO practice_orders (product_id)
SELECT id FROM deducted
RETURNING *;

COMMIT;

-- 15. 查看庫存與訂單

SELECT * FROM practice_products;

SELECT * FROM practice_orders;