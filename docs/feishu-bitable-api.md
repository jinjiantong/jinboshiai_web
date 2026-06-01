# 飞书多维表格 API 文档

## 概述

本项目使用飞书多维表格（Bitable）作为数据存储后端，所有数据通过飞书 Open API 进行管理。

### 基础配置

- **App ID**: `cli_a96bb944bef89bcb`
- **App Secret**: `IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp`
- **Bitable Token**: `LrzibrgRsaviAQsiywBcpZQ4nwc`

### 表 ID 映射

| 模块 | 表 ID | 说明 |
|------|-------|------|
| 学员档案 | `tblhnKUAyBJbpoDo` | 学员信息表 |
| 老师档案 | `tblxN3e1fyhOMTSt` | 老师信息表 |
| 班级档案 | `tblDDKeft6iLlGAx` | 班级信息表 |
| 课程表 | `tblThjrxFT0mZ3pL` | 课程信息表 |
| 缴费记录 | `tblhIFrvvseuEgIh` | 缴费信息表 |
| 考勤记录 | `tbl28gcD5cNjhYg8` | 考勤信息表 |

---

## 学员档案表 (`tblhnKUAyBJbpoDo`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 学员ID | 文本 | 自动生成的学员编号 |
| 姓名 | 文本 | 学员姓名 |
| 性别 | 单选 | 男/女 |
| 年龄 | 数字 | 学员年龄 |
| 联系电话 | 文本 | 联系方式 |
| 微信 | 文本 | 微信号 |
| 来源渠道 | 单选 | 来源渠道 |
| 报名日期 | 日期 | 报名时间 |
| 学习状态 | 单选 | 学习状态 |

---

## 老师档案表 (`tblxN3e1fyhOMTSt`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 老师ID | 文本 | 自动生成的老师编号 |
| 老师姓名 | 文本 | 老师姓名 |
| 联系电话 | 文本 | 联系方式 |
| 授课科目 | 多选 | 授课科目 |
| 可带班级 | 数字 | 可带班级数量 |
| 授课课时统计 | 数字 | 已授课时数 |
| 老师绩效 | 数字 | 绩效得分 |
| 上课评价 | 文本 | 评价备注 |
| 上课班级ID | 关联 | 关联的班级 |

---

## 班级档案表 (`tblDDKeft6iLlGAx`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 班级ID | 文本 | 班级编号 |
| 班级分类 | 单选 | 班级名称/分类 |
| 班级状态 | 单选 | 班级状态 |
| 上课时间段 | 文本 | 上课时间 |
| 授课老师 | 关联 | 关联的老师 |
| 教室编号 | 文本 | 上课教室 |
| 开班日期 | 日期 | 开班时间 |
| 结课日期 | 日期 | 结课时间 |
| 总课时数 | 文本 | 总课时 |
| 剩余课时 | 数字 | 剩余课时 |
| 课程周期 | 文本 | 课程周期 |
| 关联课程 | 关联 | 关联的课程 |
| 关联学员 | 关联 | 关联的学员 |
| 关联学员列表 | 双向关联 | 关联学员列表 |
| 课程大纲 | 文本 | 课程内容 |
| 备注 | 文本 | 备注信息 |
| **是否结课** | **复选框** | **是否已结课** |

---

## 课程表 (`tblThjrxFT0mZ3pL`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 课程名称 | 单选 | 课程名称 |
| 课程类型 | 单选 | 课程类型 |
| 课时 | 数字 | 课程课时数 |
| 课程时长 | 数字 | 单课时时长 |
| 班级人数 | 数字 | 班级人数 |
| 满班人数 | 数字 | 满班人数 |

---

## 缴费记录表 (`tblhIFrvvseuEgIh`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 应收学费 | 货币 | 应缴学费 |
| 缴费金额 | 货币 | 实缴金额 |
| 缴费类型 | 单选 | 缴费类型 |
| 收款方式 | 单选 | 收款方式 |

---

## 考勤记录表 (`tbl28gcD5cNjhYg8`)

### 字段结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| 签到状态 | 单选 | 签到状态 |
| 签到方式 | 单选 | 签到方式 |
| 请假原因 | 文本 | 请假原因 |

---

## API 接口列表

### 学员管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/students` | 获取学员列表 |
| POST | `/api/student-management/students` | 添加学员 |
| PUT | `/api/student-management/students` | 更新学员 |
| DELETE | `/api/student-management/students` | 删除学员 |

### 老师管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/teachers` | 获取老师列表 |
| GET | `/api/student-management/teachers/full` | 获取老师列表（含班级信息） |
| POST | `/api/student-management/teachers` | 添加老师 |
| PUT | `/api/student-management/teachers` | 更新老师 |
| DELETE | `/api/student-management/teachers` | 删除老师 |

### 班级管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/courses` | 获取班级列表 |
| POST | `/api/student-management/courses` | 添加班级 |
| PUT | `/api/student-management/courses` | 更新班级 |
| DELETE | `/api/student-management/courses` | 删除班级 |
| POST | `/api/student-management/classes/batch-info` | 批量获取班级信息 |

### 课程管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/courses/info` | 获取课程列表 |
| POST | `/api/student-management/courses/info` | 添加课程 |

### 缴费管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/payments` | 获取缴费列表 |
| POST | `/api/student-management/payments` | 添加缴费记录 |
| PUT | `/api/student-management/payments` | 更新缴费记录 |
| DELETE | `/api/student-management/payments` | 删除缴费记录 |

### 考勤管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/student-management/attendance` | 获取考勤列表 |
| POST | `/api/student-management/attendance` | 添加考勤记录 |
| PUT | `/api/student-management/attendance` | 更新考勤记录 |
| DELETE | `/api/student-management/attendance` | 删除考勤记录 |

---

## 响应格式

### 成功响应

```json
{
  "code": 0,
  "data": [...],
  "message": "Success",
  "timestamp": 1780320483352
}
```

### 错误响应

```json
{
  "code": -1,
  "msg": "错误信息",
  "timestamp": 1780320483352
}
```

---

## 数据处理工具

### 字段类型转换

飞书 API 返回的字段可能包含富文本格式，使用 `extractText()` 函数提取纯文本：

```typescript
import { extractText } from '../utils/dataProcessor';

// 富文本格式：[{ text: "内容", type: "text" }]
extractText(item.fields['老师姓名']) // 返回 "老师姓名"
```

### 字段验证

使用 `validateAndConvertFields()` 进行字段类型验证和转换：

```typescript
import { validateAndConvertFields } from '../utils/dataProcessor';

const fields = validateAndConvertFields(body, 'students');
```

---

## 缓存策略

- 列表缓存：30 秒 TTL
- 记录缓存：30 秒 TTL
- Access Token：自动管理，过期前自动刷新

---

## 注意事项

1. **关联字段**：飞书的关联字段返回格式为 `[{ record_ids: [...], text: "...", text_arr: [...] }]`
2. **富文本字段**：文本字段可能返回富文本格式，需要使用 `extractText()` 处理
3. **数字字段**：从表单提交的可能是字符串，需要在 API 层转换为数字类型
4. **缓存清除**：添加、更新、删除操作后会自动清除相关缓存
