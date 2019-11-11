

var dbconn = ODS.GetConnection();


//ST01 대분류
var sql ="SELECT CatCd, Lv, CatNm \r\n"
         +"    , CmpyCd, ParentCd, Remarks \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt \r\n"
         +"FROM EFormCategory \r\n"
         +"WHERE CmpyCd=@CmpyCd AND Lv='1' \r\n"

if( Request.ParamGet("Lv1") != "" )    sql = sql + "AND CatNm LIKE '%'+@Lv1+'%' \r\n"
if( Request.ParamGet("Lv2") != "" )    sql = sql + "AND CatCd IN ( SELECT ParentCd FROM EFormCategory \r\n"
                                                 + "                              WHERE CmpyCd=@CmpyCd \r\n"
                                                 + "                                AND Lv='2' \r\n"
                                                 + "                                AND CatNm LIKE '%'+@Lv2+'%' ) \r\n"
if( Request.ParamGet("Lv3") != "" )    sql = sql + "AND CatCd IN ( SELECT ParentCd FROM EFormCategory \r\n"
                                                 + "                              WHERE CmpyCd=@CmpyCd \r\n"
                                                 + "                                AND CatCd IN (SELECT ParentCd FROM EFormCategory \r\n"
                                                 + "                                                             WHERE CmpyCd=@CmpyCd \r\n"
                                                 + "                                                               AND Lv='3' \r\n"
                                                 + "                                                               AND CatNm LIKE '%'+@Lv3+'%' )) \r\n"


dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@Lv1", Request.ParamGet("Lv1"));
dbconn.AddParameter("@Lv2", Request.ParamGet("Lv2"));
dbconn.AddParameter("@Lv3", Request.ParamGet("Lv3"));

ODS.TraceQueryState("query_detail_ST01", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SUB_SetRecordSet("ST01", rset);
rset.Close();



//ST02 중분류
var sql ="SELECT CatCd, Lv, CatNm \r\n"
         +"    , CmpyCd, ParentCd, Remarks \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt \r\n"
         +"FROM EFormCategory \r\n"
         +"WHERE CmpyCd=@CmpyCd AND Lv='2' \r\n"

if( Request.ParamGet("Lv2") != "" )    sql = sql + "AND CatNm LIKE '%'+@Lv2+'%' \r\n"
if( Request.ParamGet("Lv3") != "" )    sql = sql + "AND CatCd IN ( SELECT ParentCd FROM EFormCategory \r\n"
                                                 + "                              WHERE CmpyCd=@CmpyCd \r\n"
                                                 + "                                AND Lv='3' \r\n"
                                                 + "                                AND CatNm LIKE '%'+@Lv3+'%' ) \r\n"

dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@Lv1", Request.ParamGet("Lv1"));
dbconn.AddParameter("@Lv2", Request.ParamGet("Lv2"));
dbconn.AddParameter("@Lv3", Request.ParamGet("Lv3"));

ODS.TraceQueryState("query_detail_ST02", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SUB_SetRecordSet("ST02", rset);
rset.Close();



//ST03 소분류
var sql ="SELECT CatCd, Lv, CatNm \r\n"
         +"    , CmpyCd, ParentCd, Remarks \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt \r\n"
         +"FROM EFormCategory  \r\n"
         +"WHERE CmpyCd=@CmpyCd AND Lv='3' \r\n"
         
if( Request.ParamGet("Lv3") != "" )    sql = sql + "AND CatNm LIKE '%'+@Lv3+'%' \r\n"

dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@Lv1", Request.ParamGet("Lv1"));
dbconn.AddParameter("@Lv2", Request.ParamGet("Lv2"));
dbconn.AddParameter("@Lv3", Request.ParamGet("Lv3"));

ODS.TraceQueryState("query_detail_ST03", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SUB_SetRecordSet("ST03", rset);
rset.Close();
