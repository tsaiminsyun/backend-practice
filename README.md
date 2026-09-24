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

目前資料先存在記憶體陣列中，尚未接資料庫。

## Tech Stack

- Node.js
- TypeScript
- Express
- pnpm

## Project Structure

```txt
src
├── index.ts
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
```

## Architecture

目前專案採用簡單分層：

```txt
index.ts       啟動 Express app
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

目前資料存在記憶體陣列中。未來可以把這一層改成連接資料庫。

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
    "completed": false
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
    "completed": false
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
    "completed": true
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
  "title": ""
}
```

Response:

```json
{
  "message": "title must be a non-empty string"
}
```

### Completed

`completed` 必須是 boolean。

錯誤範例：

```json
{
  "completed": "yes"
}
```

Response:

```json
{
  "message": "completed must be a boolean"
}
```

## Scripts

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Start

```bash
pnpm start
```

## What I Learned

目前已完成後端基本架構：

- 建立 Express server
- 建立 RESTful Todo API
- 理解 CRUD
- 使用 TypeScript 定義資料型別
- 拆分 routes
- 拆分 controllers
- 拆分 services
- 加上基本資料驗證
- 加上 centralized error handling
- 理解 route handler 拆出去後，需要補上 params 型別
- 理解 `AppError` 與 error middleware 的用途

## Next Steps

接下來可以繼續練習：

- 加入 PostgreSQL
- 使用 Prisma
- 加入環境變數 `.env`
- 加入登入功能
- 加入測試
- 加入 Docker
- 部署 API