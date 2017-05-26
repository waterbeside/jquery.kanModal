# jquery.kanModal.js


## 簡介

此為一個簡單的jquery模態框插件，基於bootstrap樣式 <br>

## 用法

用法請參照demo

## 設置

| 名稱 | 說明 |
| --- | --- |
| title | 標題 |
| remote | 使用ajax加載内容時之url也 |
| target | 生成的模态框指定id，默認為#modal |
| draggable | 是否可拖放 |
| handle | 如果能拖放，指定鼠標能拖放对像，默認為.modal-header |
| width | 指定寬度 |
| btns | 設定按鈕，默認有['refresh','close','submit']三個按鈕 |
| data | ajax請求時設定傳递的參數 |
| content | 若不使用ajax加載内容，可用data設定内容 |

## 事件

| 事件 | 參數 | 說明 |
| --- | --- | --- |
| onLoadSuccess | self | 數據加載完成時觸發 |
| onClose | options | 当關閉模態框時觸發 |

## 方法

| 方法 | 參數 | 說明 |
| --- | --- | --- |
| show | null | 顯示 |
| close | null | 關閉 |
| reload | null | 重載數據 |
| load | url | 加載指定地址數據 |
