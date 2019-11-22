

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM EFormDic \r\n"
         +"WHERE DicID=@DicID \r\n"


dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));


ODS.TraceQueryState("EFormDic_delete_sc_root", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


