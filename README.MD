# 致诚书院 CityHunt 系统规划

## 活动介绍

City Hunt 是由致诚团委组织，面向全校同学开展的活动。活动中，四名选手组成一组，按组委会发布的任务清单要求前往各个打卡点打卡积分，活动结束时将所有组按积分排序决出优胜者。

## 任务清单样例

> ## 注意事项及说明
>
> - 请严格按照打卡点的样图和文字要求拍照上传，审核结果将会实时返回。请确认审核通过后再前往下一打卡点。
> - 每个打卡点描述开头的数字为 首个打卡的队伍得分/第二名得分/第三名得分/其余队伍得分。
> - “至少三人”表示照片中应出现至少三名小组成员；如未指明“按图中姿势”，则姿势可任意选取。
>
> ## 1 南科大
>
> ### 区域综述
>
> 这是一个示例区域，所有点位均在南科大校园内。
>
> ### 1-1 湖畔公寓区
>
> 6/5/4/3 在图中所示位置按图中所示姿势拍照。至少三人。
>```
> ![图1-1](图1-1)
>```
> ### 1-2 学生宿舍校巴站附近
>
> 8/7/6/5 找到图1中所示标识并合影。至少三人。若照片中同时包含图2中所示标识额外+2分。
>```
> ![图1-2-1](图1-2-1)
>
> ![图1-2-2](图1-2-2)
> ```
> ## 2 xx大厦
> ……

## 系统规划 

### 前端整体 挂载在 `/` 下

页面应能按下述的详细要求从服务器实时获取信息，并在连接异常时提示用户。

### 通用

```
/login
```
用户登录。

```
/changepassword
```
修改密码。

### 选手端

#### 比赛开始前（通过配置文件）

后台登记选手，设置默认密码。

#### 比赛时

```
/checkpoints
```

选手可以浏览所有打卡点，并选择打卡点上传本组打卡照片。照片只能上传一张，不超过 10MB。

打卡点分为四个状态：未打卡，待审核，未通过，已完成。每个状态下应展示的信息如下：

- 未打卡：点位信息，当前已通过人数，我的打卡图片（点击上传）
- 待审核：点位信息，当前已通过人数，我的打卡图片（点击查看/重新上传），我的打卡时间，我的预计得分（包含所有已通过/待审核的队伍的排名）
- 未通过：点位信息，当前已通过人数，我的打卡图片（点击查看/重新上传），我的打卡时间，未通过原因
- 已完成：待审核：点位信息，当前已通过人数，我的打卡图片（点击查看/重新上传），我的打卡时间，我的得分。
- 我的得分显示方式为 3 ，无附加分 / 3(+2)，有附加分，附加分说明见管理端

选手应能在不手动刷新页面的前提下看到实时推送的通知，通知出现在页面顶部，确认后消失。任何一个打卡点状态变更；打卡点分数变更（因为管理员手动修改/其他组的状态变更导致排名变化）。打卡点状态也为实时更新。通知应有声音提示。

页面中应有浮动的回到顶部按钮，如果有新通知，按钮上展示红点。

#### 比赛结束后

可以继续查看本队打卡信息，但不能继续上传图片。排行榜数据**不**自动展示，待后台审核后另外发布。

### 管理端

#### 比赛开始前（通过配置文件）

管理员可以登记每队队长的用户名（学号），默认密码。

管理员可以添加/导入区域、打卡点的信息（编号，名称，描述，分值，图片）。

#### 比赛时

```
/submissions
```

管理端控制选手的提交。管理员可以：

- 按打卡区域，状态，提交的组号（组长学号），打卡点号筛选提交
- 提交应包含：组名，小组合照，打卡图片，打卡时间，操作
- 手动修改某一提交记录的状态（修改为通过/拒绝/修改附加分），并通知所有受影响的选手
    - 为通过的提交输入附加分，接受任意正负整数（空置为0），加值到队伍的最终得分上。
    - 为拒绝的提交输入拒绝原因。

系统应在无需手动刷新的情况下自动将新的提交追加至页面最后，并有声音提示。

**无需**存储历史提交记录，只需记录最后一次提交。

#### 结束后

管理员应能导出（csv即可）含有组id、组名、各打卡点积分及总积分的表格，以备后续处理。

### 比赛中的逻辑

#### 名次

- 计算“我的预期得分时”，名次 = （当前点）已通过人数 + 待审核人数 + 1
- 计算实际得分时，名次 = 当前点打卡时间早于（严格小于）我的打卡时间的已通过人数 + 1
- 打卡时间以服务器收到请求时间为准
- 管理员修改某提交状态/新审核通过一个提交时，可能导致该打卡点其他组的名次变更

### 后端挂载在 `/api` 下

```
1.  GET /checkpoints with uid (user id)
    Return checkpoints info in json
    {[{
    	"id": "1",
    	"name": "SUSTech",
     	"desc": "All points are in SUSTech",
      	"points": [{
      		"id": "1-1",
          	"name": "Lecture Hall 1",
          	"scores": [6, 5, 4, 3],
          	"desc": "Take a photo as given",
          	"images": ["1-1-1.jpg", "1-1-2.jpg"],
          	"passed": 0, // Users that has submitted an accepted answer
          	"state": "pending", // or "accepted", "denied", null
          	"uploaded_time": "", // An ISO string describing time or null
          	"photo": "U12210101-P1-1.jpg", // or null
          	"score": "0(+2)", // or null
          	"fail_reason": "" // or a string containing reason
          	// Read these 6 above from submissions
        },]
    },]}

2.  GET /checkpoint/:checkpointid with uid
	Return checkpoint info in json
	{
		"id": "1-1",
		"name": "Lecture Hall 1",
		"scores": [6, 5, 4, 3],
		...
	}
    
3.  POST /submit/:checkpointid in img file with uid
	Create/Update submission, update all related ones and return result
	
4. 	POST /submissions/query in json
	{
		"checkpoints": ["1-1"],
		"users": ["12210101"],
		"states": ["pending"]
	}
	Return matching submissions in json
	[{
		"id": "U12210101-P1-1"
		"checkpoint": "1-1",
		"user": "12210101",
		"photo": "U12210101-P1-1.jpg",
		"state": "pending",
		"uploaded_time": "", // ISO format
		"score": 0,
		"bonus": 0
	}]
	
5.  POST /submissions/modify in json
	{
		// Like the json above
	}
	Change submission, update all related ones and return result
	Unchanged fields may not be in the request.
```

User related

```
6.  POST /login in json
	{
		"uid": "12210101",
		"password": "" // hashed
	}
	Return in json
	{
		"uid": "12210101"
		"token": "xxxxx",
		"type": "user",
		"err_msg": ""
	}
	
7.  GET /logout
	Reset uid and token
```

Socket.io

When one submission's state changes, the server emits 'update point' event
with {point.id} message, then the client gets the new info from API
`GET /checkpoint/:checkpointid` and update local rendering.
For `/submissions` page, simply query the submissions again.

Static files

```
/static
	public folder, including checkpoint desc. images
/uploads
	Auth required, for user uploaded photos
```

### 数据库

```js
const submissionSchema = new Schema({
	checkpoint: String, // Checkpoint id
    user: String, // User id
    photo: String, // Photo name (generate from the 2 ids like above)
    uploaded: {type: Date, default: Date.now() }, // time
    state: {type: String, enum:["pending", "accepted", "denied"], required: true },
	score: Number,
    bonus: Number
})

const userSchema = new Schema({
    uid: String,
    password: String
})
```

### 打卡点信息预配置

暂定使用 json 提前配好：

```json
[
{
    "name": "SUSTech",
    "desc": "All points are in SUSTech.",
    "points": [ {
        "id": "1-1",
        "name": "Lecture Hall 1",
        "scores": [6, 5, 4, 3],
        "desc": "Take a photo as given",
        "images": ["1-1-1.jpg", "1-1-2.jpg"]
    }, {
        "id": "1-2",
        "name": "Lecture Hall 2",
        "scores": [6, 5, 4, 3],
        "desc": "Take a photo as given",
        "images": ["2-1.jpg"]
    } ]
}, {
    "name": "Shenzhanbei Railway Station",
    "desc": "All points are in or around the station.",
    "points": []
}
]
```

## 项目说明

本前端系统采用 React 开发。

部署：clone 到本地后 `yarn` & `yarn start`。

注意运行前将 config_example.json 改为 config.json 并按需修改其中的设置项。

## 项目进度

- [ ] 用户系统
    - [x] 登录/登出的前端
    - [ ] 登录/登出的后端
    - [ ] 在各个页面通过 token 获取 uid 并进行相应操作
- [ ] 选手端 UI `/checkpoints`
    - [x] 总体框架
    - [ ] 浮动的，在有通知时展示的回到顶部按钮
- [ ] 选手端与后端的交互
    - [ ] 提交文件
    - [ ] 获取打卡点的变更，更新、推送通知
- [x] 管理端 UI `/submissions`
- [ ] 管理端与后端的交互
    - [ ] 点击筛选按钮时，向后端发送包含筛选条件的 json 请求，渲染获取到的提交记录
    - [ ] 修改一个提交记录