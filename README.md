# 安安的約會邀請

一個純前端、無後端的 React + Vite 約會邀請網站。

## 開發

```bash
npm install
npm run dev
```

## 修改內容

所有約會內容集中在 `src/main.jsx` 最上方的 `dateConfig`：

- `partnerName`：安安的名字
- `myName`：邀請人的名字
- `date`：預設日期，留空時讓安安在答應約會後選擇
- `datePlaceholder`：尚未選日期時的提示文字
- `time`：時間
- `meetingLocation`：集合地點
- `dressCode`：Dress Code
- `schedule`：行程陣列，每個項目包含 `time`、`icon`、`title`、`description`

流程會先讓安安選擇是否答應約會，按下「要！」後才會出現日期選擇畫面。日期只能選明天以後，選定的日期會同步帶到最後的確認畫面與約會券。

配色與版面集中在 `src/styles.css` 最上方的 CSS 變數，例如 `--pink`、`--rose`、`--cream`。

## 部署到 Vercel

1. 將專案推到 GitHub。
2. 登入 Vercel，選擇 **Add New Project**，匯入這個 repository。
3. Framework Preset 選擇 **Vite**。
4. Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
5. 按下 Deploy，完成後把 Vercel 網址透過 LINE 傳給安安。

也可以在本機先執行 `npm run build` 確認 production build 成功，再部署。
