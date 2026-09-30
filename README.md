# Backend Practice

這是一個用 TypeScript + Express 建立的後端練習專案。

目前目標是從最基本的 API 開始，逐步熟悉後端開發流程，包含：

- Express server
- RESTful API
- CRUD
- Route 拆分
- Controller layer
- Service layer
- TypeScript 型別
- 基本資料驗證
- 統一錯誤處理
- Prisma ORM
- SQLite database
- 環境變數管理

目前 Todo 資料已經從記憶體陣列改成 SQLite 資料庫儲存。

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- SQLite
- pnpm
- dotenv

## Project Structure

```txt
src
├── index.ts
├── config
│   └── env.ts
├── lib
│   ├── prisma.ts
│   └── prismaError.ts
├── routes
│   └── todos.ts
├── controllers
│   └── todoController.ts
├── services
│   └── todoService.ts
├── types
│   └── todo.ts
├── errors
│   └── AppError.ts
└── middlewares
    └── errorHandler.ts

prisma
└── schema.prisma
```

## Architecture

目前專案採用簡單分層：

```txt
index.ts       啟動 Express app
config         管理環境變數
lib            放共用工具，例如 Prisma client
routes         定義 API 路由
controllers    處理 request / response
services       處理資料邏輯
types          定義資料模型型別
errors         定義自訂錯誤
middlewares    處理共用 middleware
```

### Responsibility

#### index.ts

負責建立 Express app、掛載 middleware、掛載 routes，並啟動 server。

```ts
app.use(express.json());
app.use("/todos", todosRouter);
app.use(errorHandler);
```

`errorHandler` 必須放在 routes 後面，才能接住前面丟出的錯誤。

#### config

負責集中管理環境變數。

目前有：

```txt
src/config/env.ts
```

所有 `process.env` 都集中在這裡處理，其他檔案不直接讀取 `process.env`。

例如：

```ts
export const env = {
  port: getPort(process.env.PORT),
  databaseUrl: getRequiredEnv("DATABASE_URL"),
};
```

#### lib

負責放共用工具。

目前有：

```txt
src/lib/prisma.ts
src/lib/prismaError.ts
```

`prisma.ts` 負責建立 Prisma Client。

`prismaError.ts` 負責判斷 Prisma 錯誤，例如 `P2025`。

#### routes

負責定義 URL 與 controller handler 的對應關係。

例如：

```ts
todosRouter.get("/", getTodosHandler);
todosRouter.post("/", createTodoHandler);
todosRouter.get("/:id", getTodoByIdHandler);
todosRouter.patch("/:id", updateTodoHandler);
todosRouter.delete("/:id", deleteTodoHandler);
```

routes 不處理商業邏輯，也不直接操作資料。

#### controllers

負責處理 HTTP 相關邏輯，例如：

- 讀取 `req.params`
- 讀取 `req.body`
- 驗證 request 資料
- 呼叫 service
- 回傳 response
- 丟出 HTTP 錯誤

controller 不直接處理資料儲存邏輯。

#### services

負責處理資料操作邏輯，例如：

- 取得 todos
- 新增 todo
- 查詢單筆 todo
- 修改 todo
- 刪除 todo

目前這一層透過 Prisma 操作 SQLite 資料庫。

#### types

負責放資料模型型別。

例如：

```ts
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
```

不會把所有型別都放進 `types`。  
只有和資料本身有關的型別才放這裡。

像 `TodoParams` 這種 Express route 專用型別，會放在 controller 附近。

#### errors

負責定義自訂錯誤。

例如：

```ts
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
  }
}
```

`AppError` 用來表示可以預期的 HTTP 錯誤，例如：

- 400 Bad Request
- 404 Not Found

#### middlewares

負責放共用 middleware。

目前有：

```txt
errorHandler.ts
```

`errorHandler` 負責統一處理錯誤 response。

## Database

目前使用 SQLite。

SQLite 是本機檔案型資料庫。  
資料會存在本機的 `.db` 檔案中，不需要另外啟動資料庫服務。

目前 Prisma schema 定義在：

```txt
prisma/schema.prisma
```

Todo model：

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Prisma Commands

建立 migration：

```bash
pnpm prisma migrate dev --name init
```

重新產生 Prisma Client：

```bash
pnpm prisma generate
```

開啟 Prisma Studio：

```bash
pnpm prisma studio
```

Prisma Studio 可以用瀏覽器查看資料表內容。

## Environment Variables

本專案使用 `.env` 管理環境變數。

`.env` 不應該被 commit。

### `.env`

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

### `.env.example`

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

`.env.example` 可以被 commit。  
它用來告訴其他開發者這個專案需要哪些環境變數。

## Error Handling

目前使用 centralized error handling。

controller 裡不重複寫：

```ts
res.status(400).json({
  message: "error message",
});
return;
```

而是改成：

```ts
throw new AppError(400, "title must be a non-empty string");
```

最後由 `errorHandler` 統一回傳：

```json
{
  "message": "title must be a non-empty string"
}
```

如果是未知錯誤，會回傳：

```json
{
  "message": "internal server error"
}
```

這樣可以讓 controller 更乾淨，也方便之後統一記錄錯誤或調整錯誤格式。

## Prisma Error Handling

Prisma 錯誤會先在 service 層處理。

例如 Prisma 的 `P2025` 代表：

```txt
record not found
```

常見情境：

```txt
update 找不到資料
delete 找不到資料
findUniqueOrThrow 找不到資料
findFirstOrThrow 找不到資料
```

service 會把 Prisma 錯誤轉成比較好處理的結果：

```ts
return null;
```

或：

```ts
return false;
```

再由 controller 決定要回傳：

```json
{
  "message": "todo not found"
}
```

## API Endpoints

### Health Check

```txt
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

### Get Todos

```txt
GET /todos
```

Response:

```json
{
  "data": []
}
```

### Create Todo

```txt
POST /todos
```

Request body:

```json
{
  "title": "Learn backend"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "title": "Learn backend",
    "completed": false,
    "createdAt": "2026-09-30T00:00:00.000Z",
    "updatedAt": "2026-09-30T00:00:00.000Z"
  }
}
```

### Get Todo By ID

```txt
GET /todos/:id
```

Response:

```json
{
  "data": {
    "id": 1,
    "title": "Learn backend",
    "completed": false,
    "createdAt": "2026-09-30T00:00:00.000Z",
    "updatedAt": "2026-09-30T00:00:00.000Z"
  }
}
```

### Update Todo

```txt
PATCH /todos/:id
```

Request body:

```json
{
  "completed": true
}
```

或：

```json
{
  "title": "Learn Express"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "title": "Learn Express",
    "completed": true,
    "createdAt": "2026-09-30T00:00:00.000Z",
    "updatedAt": "2026-09-30T00:00:00.000Z"
  }
}
```

### Delete Todo

```txt
DELETE /todos/:id
```

成功時回傳：

```txt
204 No Content
```

## Validation Rules

### Todo ID

`id` 必須是正整數。

錯誤範例：

```txt
GET /todos/abc
GET /todos/-1
```

Response:

```json
{
  "message": "id must be a positive integer"
}
```

### Title

`title` 必須是非空字串。

錯誤範例：

```json
{
  "