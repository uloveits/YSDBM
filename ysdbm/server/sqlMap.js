/**
 * Created by 网线丶 on 2018/6/23.
 */
// sql语句
var sqlMap = {
    // 用户信息
    user: {
        getUserInfo:"select * from userinfo where delFlag = '0' order by updateTime asc",
        getUserInfoById:"select * from userinfo where delFlag = '0' and id = ? and password = ?",
        getUserInfoByLogin:"select U.id," +
        " companyId," +
        " C.name," +
        " loginName," +
        " userName," +
        " role" +
        " from userinfo U left join company C" +
        " on U.companyId = C.id" +
        " where U.delFlag = '0' and loginName = ? and password = ?",
        addUser:"insert into userinfo(id,companyId, loginName, userName, password, role, delFlag, updateTime) values (?,?,?,?,?,?,0, ?)",
        deleteUser:"update userinfo set delFlag = '1' where id = ?",
        updatePassword:"update userinfo set password = ? where id = ?",
        addCompany: "insert into company (id, name, delFlag) values(?,?,0)",
        getCompany: "select * from company where delFlag = '0'"
    },
    staff: {
        addStaff:"insert into staffinfo(id, name, sex, age, phone, address, toCompany, startTime, endTime, note, delFlag,updateUser,updateTime) values (?,?,?,?,?,?,?,?,?,?,0,?,?)",
        getStaffBySearch:" select A.id," +
        " A.name," +
        " sex," +
        " address," +
        " age," +
        " phone," +
        " toCompany," +
        "  C.name as companyName," +
        " startTime," +
        " endTime," +
        " note," +
        " updateUser" +
        " from staffinfo A left join company C" +
        " on A.toCompany = C.id" +
        " where A.name like ? and C.name like ? and ( startTime > ? and startTime < ?) and updateUser like ? and A.delFlag like ?",
        getStaffById:" select A.id," +
        " A.name," +
        " sex," +
        " address," +
        " age," +
        " phone," +
        " toCompany," +
        "  C.name as companyName," +
        " startTime," +
        " endTime," +
        " note," +
        " updateUser" +
        " from staffinfo A left join company C" +
        " on A.toCompany = C.id" +
        " where A.id = ? ",
        updateStaffById:"update staffinfo set endTime = ?, note = ?, delFlag = '1' where id = ?",
    }

}

module.exports = sqlMap;
