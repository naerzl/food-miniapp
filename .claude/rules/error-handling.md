# 错误处理规范

- **API 错误**：通过 `src/api/request.ts` 的响应拦截器统一处理 401 等状态码
- **UI 错误**：使用 Ant Design 的 `message`/`notification` 组件展示用户友好的错误提示
- **捕获边界**：在页面组件的顶层处理错误，不在业务组件内部吞噬错误
