---
nav:
  title: Layout
group: PageHeader
order: 1
title: 标准样式
---

## 标准样式

标准页头，适合使用在需要简单描述的场景。

```tsx
import { PageHeader } from '@ant-design/pro-components';
import React from 'react';

const App: React.FC = () => (
  <PageHeader
    className="site-page-header"
    onBack={() => null}
    title="Title"
    subTitle="This is a subtitle"
  />
);

export default App;
```

```css
.site-page-header {
  border: 1px solid rgb(235, 237, 240);
}
```
