'use strict';

module.exports = function() {
    var _self = this;
    this.user = {
        /* 创建成员
        {
            //必填项
            "userid": "zhangsan",
            "name": "张三",
            "english_name": "jackzhang"
            "mobile": "15913215421",
            "department": [1, 2],
            //非必填项
            "order":[10,40],
            "position": "产品经理",
            "gender": "1",
            "email": "zhangsan@gzdev.com",
            "isleader": 1,
            "avatar_mediaid": "2-G6nrLmr5EC3MNb_-zL1dDdzkd0p7cNliYu9V5w7o8K0",
            "telephone": "020-123456"，
            "extattr": {"attrs":[{"name":"爱好","value":"旅游"},{"name":"卡号","value":"1234567234"}]}
        }
        */
        create: async function(data) {
            return _self.post('/cgi-bin/user/create?access_token=ACCESS_TOKEN', data);
        },
        //读取成员
        get: async function(userid) {
            return _self.get('/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=' + userid);
        },
        //更新成员
        update: async function(data) {
            return _self.post('/cgi-bin/user/update?access_token=ACCESS_TOKEN', data);
        },
        //删除成员
        delete: async function(userid) {
            return _self.get('/cgi-bin/user/delete?access_token=ACCESS_TOKEN&userid=' + userid);
        },
        /*
        批量删除成员
        {
            "useridlist": ["zhangsan", "lisi"]
        }
        */
        batchdelete: async function(useridlist) {
            if(think.isArray(useridlist)) {
                useridlist = {"useridlist": useridlist};
            }
            return _self.post('/cgi-bin/user/batchdelete?access_token=ACCESS_TOKEN', useridlist);
        },
        //获取部门成员
        simplelist: async function(department_id, fetch_child, status) {
            fetch_child = fetch_child || 0;
            status = status || 0;
            return _self.get('/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=' + department_id + '&fetch_child=' + fetch_child + '&status=' + status);
        },
        //获取部门成员详情
        list: async function(department_id, fetch_child, status) {
            fetch_child = fetch_child || 0;
            status = status || 0;
            return _self.get('/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=' + department_id + '&fetch_child=' + fetch_child + '&status=' + status);
        },
        //获取所有成员列表
        all_simplelist: async function() {
            return this.simplelist(1, 1);
        },
        //获取所有成员详情
        all_list: async function() {
            return this.list(1, 1);
        }
    }
};