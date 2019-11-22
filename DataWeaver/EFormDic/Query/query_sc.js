

var dbconn = ODS.GetConnection();


var sql ="SELECT DicID, DicCd, CmpyCd \r\n"
         +"    , DicNm, DicXML, MapSQL \r\n"
         +"    , CatCd1, CatCd2, ParentID \r\n"
         +"    , Lv, DispSeq, Remarks \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt \r\n"
         +"FROM EFormDic  \r\n"
         +"WHERE DicID=@DicID \r\n"
         
if ( Request.ParamGet("CmpyCd") != "" ) sql =sql+"   AND CmpyCd = @CmpyCd \r\n"


dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));

ODS.TraceQueryState("EFormDic_query_sc", sql, dbconn);

var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


