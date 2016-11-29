'use strict';

module.exports = function() {
    var _self = this;
    this.department = {
        /* 创建部门
        {
           "name": "广州研发中心",
           "parentid": 1,
           "order": 1,
           "id": 2
        }*/
        create: async function(data) {
            return _self.post('/cgi-bin/department/create?access_token=ACCESS_TOKEN', data);
        },
        /* 更新部门
        {
           "id": 2,
           "name": "广州研发中心",
           "parentid": 1,
           "order": 1
        }*/
        update: async function(data) {
            return _self.post('/cgi-bin/department/update?access_token=ACCESS_TOKEN', data);
        },
        //删除部门
        delete: async function(id) {
            return _self.get('/cgi-bin/department/delete?access_token=ACCESS_TOKEN&id=' + id);
        },
        //获取部门列表
        list: async function(id) {
            id = id || '';
            return _self.get('/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=' + id);
        }
    };
};