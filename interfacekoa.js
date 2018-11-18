const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const getCourses = require('./course');
const getClassmates = require('./classmates');

// 使用bodyParser解析中间件
app.use(bodyParser());

// 路由1-课程信息
let router1 = new Router();
router1.post('/syllabus', async (ctx) => {
    /**
     * 参数:
     * username: 用户名
     * password: 密码
     * years: 学年  例：2017-2018
     * semester(数字): 1-春季学期; 2-夏季学期; 3-秋季学期
     * 返回值: { 'classes': courseList }
     */
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let years = ctx.request.body.years;
    let semester = ctx.request.body.semester;
    await getCourses(username, password, years, semester).then(value => {
        let result = { 'classes': value };
        console.log(result);
        ctx.body = result;
    });
});
// 路由2-同班同学信息
let router2 = new Router();
router2.post('/member', async (ctx) => {
    /**
     * 参数: class_id
     */
    console.log(ctx.request.body);
    let class_id = ctx.request.body.class_id;
    await getClassmates(class_id).then(result => {
        console.log(result);
        ctx.body = result;
    });
});

let router = new Router();
router.use(router1.routes(), router1.allowedMethods());
router.use(router2.routes(), router2.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log('starting at port 3000');
});